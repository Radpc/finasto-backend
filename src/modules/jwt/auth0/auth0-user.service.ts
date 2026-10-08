import {
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AppException } from 'src/common/errors/app.exception';
import { ErrorCode } from 'src/common/errors/error-code';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { UserDomain } from 'src/modules/user/domain/user.domain';

type UserInfo = { email?: string; email_verified?: boolean };

/**
 * Maps an Auth0 identity to a Finasto user.
 *
 * The first time someone signs in with Auth0 we look up their email through
 * Auth0's /userinfo endpoint and link it to the existing user with that email.
 * Only verified emails are linked, so nobody can claim an account by signing
 * up with someone else's address.
 */
@Injectable()
export class Auth0UserService {
  private readonly logger = new Logger(Auth0UserService.name);

  constructor(private readonly userRepo: UserRepoService) {}

  async resolve(params: {
    sub: string;
    accessToken: string;
    userInfoUri: string;
  }): Promise<UserDomain> {
    const linked = await this.userRepo.getUser({
      where: { auth0Sub: params.sub },
    });
    if (linked) return linked;

    const info = await this.fetchUserInfo(
      params.userInfoUri,
      params.accessToken,
    );
    if (!info.email || info.email_verified !== true) {
      throw new AppException(
        ErrorCode.EmailNotVerified,
        HttpStatus.FORBIDDEN,
        'Verify your email address to sign in',
      );
    }

    await this.userRepo.linkAuth0Sub(info.email, params.sub);

    // Read back by sub: if the email belonged to an account already linked to
    // another Auth0 identity, nothing was linked and this finds no one.
    const user = await this.userRepo.getUser({
      where: { auth0Sub: params.sub },
    });
    if (!user) {
      throw new AppException(
        ErrorCode.NoAccountForEmail,
        HttpStatus.FORBIDDEN,
        'There is no Finasto account for this email',
      );
    }

    this.logger.log(`Linked Auth0 identity to user ${user.id}`);
    return user;
  }

  private async fetchUserInfo(uri: string, accessToken: string) {
    const res = await fetch(uri, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(5_000),
    }).catch(() => null);

    if (!res?.ok) throw new UnauthorizedException();
    return (await res.json()) as UserInfo;
  }
}
