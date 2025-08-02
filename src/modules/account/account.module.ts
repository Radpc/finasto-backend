import { Module } from '@nestjs/common';
import { CreateAccountController } from './use-cases/create-account/create-account.controller';
import { GetAccountByIdController } from './use-cases/get-account-by-id/get-account-by-id.controller';
import { ListAccountController } from './use-cases/list-accounts/list-accounts.controller';
import { UpdateAccountController } from './use-cases/update-account/update-account.controller';
import { CreateAccountService } from './use-cases/create-account/create-account.service';
import { GetAccountByIdService } from './use-cases/get-account-by-id/get-account-by-id.service';
import { ListAccountsService } from './use-cases/list-accounts/list-accounts.service';
import { UpdateAccountService } from './use-cases/update-account/update-account.service';
import { PrismaModule } from 'src/database/prisma.module';
import { CheckUserFamilyPermissionService } from '../family/providers/check-user-family-permission.service';
import { AccountRepoService } from 'src/database/repositories/account/account-repo.service';
import { FamilyRepoService } from 'src/database/repositories/family/family-repo.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateAccountController,
    GetAccountByIdController,
    ListAccountController,
    UpdateAccountController,
  ],
  providers: [
    CreateAccountService,
    GetAccountByIdService,
    ListAccountsService,
    UpdateAccountService,

    // Repo
    AccountRepoService,
    FamilyRepoService,

    // Extra
    CheckUserFamilyPermissionService,
  ],
})
export class AccountModule {}
