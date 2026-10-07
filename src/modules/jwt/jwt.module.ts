import { Global, Module } from '@nestjs/common';
import { ApiKeyStrategy } from './strategies/apiKey.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Auth0Strategy } from './strategies/auth0.strategy';
import { Auth0UserService } from './auth0/auth0-user.service';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { PrismaModule } from 'src/database/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    Auth0Strategy,
    Auth0UserService,
    JwtStrategy,
    ApiKeyStrategy,
    UserRepoService,
  ],
  exports: [Auth0Strategy, JwtStrategy, ApiKeyStrategy],
})
export class JwtModule {}
