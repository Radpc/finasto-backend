import { Module } from '@nestjs/common';
import { LoginService } from '../auth/use-cases/login/login.service';
import { LoginController } from '../auth/use-cases/login/login.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { GetUserByIdController } from './use-cases/get-user-by-id/get-user-by-id.controller';
import { ListUsersController } from './use-cases/list-users/list-users.controller';
import { CreateUserService } from './use-cases/create-user/create-user.service';
import { GetUserByIdService } from './use-cases/get-user-by-id/get-user-by-id.service';
import { ListUsersService } from './use-cases/list-users/list-users.service';
import { GetMeController } from './use-cases/get-me/get-me.controller';
import { GetMeService } from './use-cases/get-me/get-me.service';
import { UserJwtService } from '../jwt/user-jwt/user-jwt.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    LoginController,
    GetMeController,
    CreateUserController,
    GetUserByIdController,
    ListUsersController,
  ],
  providers: [
    LoginService,
    GetMeService,
    CreateUserService,
    GetUserByIdService,
    ListUsersService,
    UserJwtService,

    // Repos
    UserRepoService,
  ],
})
export class UsersModule {}
