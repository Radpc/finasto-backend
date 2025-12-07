import Strategy from 'passport-headerapikey';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { apiKeyEncrypt } from 'src/utils/encryption';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'x-api-key') {
  async validate(apiKey: any, done: any) {
    let encryptedApiKey = '';

    try {
      encryptedApiKey = apiKeyEncrypt(apiKey);
    } catch (err) {
      return done(new UnauthorizedException(), null);
    }

    if (!apiKey) return done(new UnauthorizedException(), null);

    const user = await this.userRepo.findByApiKeyHash(encryptedApiKey);
    if (!user) return done(new UnauthorizedException(), null);

    done(null, { user });
  }

  constructor(private readonly userRepo: UserRepoService) {
    super({ header: 'x-api-key', prefix: '' } as any, false);
  }
}
