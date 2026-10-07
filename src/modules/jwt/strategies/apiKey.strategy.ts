import Strategy from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { hashApiKey } from 'src/utils/api-key';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'x-api-key') {
  async validate(apiKey: any, done: any) {
    if (typeof apiKey !== 'string' || !apiKey) {
      return done(new UnauthorizedException(), null);
    }

    const user = await this.userRepo.findByApiKeyHash(hashApiKey(apiKey));
    if (!user) return done(new UnauthorizedException(), null);

    done(null, user.toDTO());
  }

  constructor(private readonly userRepo: UserRepoService) {
    super({ header: 'x-api-key', prefix: '' } as any, false);
  }
}
