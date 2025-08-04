import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import {
  Requester,
  UserJwtService,
} from 'src/modules/jwt/user-jwt/user-jwt.service';

@Injectable()
export class LoginService {
  constructor(
    private jwtService: UserJwtService,
    private userRepositoryService: UserRepoService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepositoryService.getUser({
      where: { email },
      include: { families: true },
    });

    if (!user || !(await user.isPasswordValid(password)))
      throw new ForbiddenException('Invalid email and/or password');

    const requesterPayload: Requester = {
      userId: user.id,
      role: user.role,
    };
    const jwt = await this.jwtService.encodeJWT(requesterPayload);
    return { jwt, user: user.toDTO() };
  }
}
