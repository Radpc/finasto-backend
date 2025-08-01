import { Injectable } from '@nestjs/common';
import { UpdateAccountDTO } from '../../dto/update-account.dto';
import { AccountDomain } from '../../domain/account.domain';
import { AccountRepoService } from 'src/database/repositories/account/account-repo.service';

type Input = {
  accountId: string;
  payload: UpdateAccountDTO;
  requesterId: string;
};
type Output = {
  data: AccountDomain;
  message: 'Success';
};

@Injectable()
export class UpdateAccountService {
  constructor(private readonly accountRepoService: AccountRepoService) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepoService.updateAccount({
      where: {
        id: input.accountId,
        family: { users: { some: { id: input.requesterId } } },
      },
      data: {
        name: input.payload.name,
      },
    });

    return {
      data: account,
      message: 'Success',
    };
  }
}
