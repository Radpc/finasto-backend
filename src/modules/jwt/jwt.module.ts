import { Global, Module } from '@nestjs/common';
import { ApiKeyStrategy } from './strategies/apiKey.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { PrismaModule } from 'src/database/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [JwtStrategy, ApiKeyStrategy, UserRepoService],
  exports: [JwtStrategy, ApiKeyStrategy],
})
export class JwtModule {}
