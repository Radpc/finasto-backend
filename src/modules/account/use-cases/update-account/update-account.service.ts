import { Injectable } from '@nestjs/common';
import { UpdateAccountDTO } from '../../dto/update-account.dto';
import { AccountDomain } from '../../domain/account.domain';
import { AccountRepoService } from 'src/database/repositories/account/account-repo.service';

type Input = {
  accountId: string;
  payload: UpdateAccountDTO;
  familyId: string;
};
type Output = AccountDomain;

@Injectable()
export class UpdateAccountService {
  constructor(private readonly accountRepoService: AccountRepoService) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepoService.updateAccount(
      input.familyId,
      {
        where: { id: input.accountId },
        data: {
          name: input.payload.name,
        },
      },
    );

    return account;
  }
}
