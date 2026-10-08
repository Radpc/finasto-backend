import { Injectable } from '@nestjs/common';
import { AccountRepoService } from 'src/database/repositories/account/account-repo.service';
import { CreateAccountDTO } from '../../dto/create-account.dto';
import { AccountDomain } from '../../domain/account.domain';
import { CheckUserFamilyPermissionService } from 'src/modules/family/providers/check-user-family-permission.service';

type Input = {
  payload: CreateAccountDTO;
  requesterId: string;
};
type Output = AccountDomain;

@Injectable()
export class CreateAccountService {
  constructor(
    private readonly accountRepoService: AccountRepoService,
    private readonly checkUserFamilyPermissionService: CheckUserFamilyPermissionService,
  ) {}

  async execute(input: Input): Promise<Output> {
    // Check family permission
    const family = await this.checkUserFamilyPermissionService.execute({
      userId: input.requesterId,
      familyId: input.payload.familyId,
    });

    const res = await this.accountRepoService.createAccount({
      name: input.payload.name,
      family: { connect: { id: family.id } },
    });

    return res;
  }
}
