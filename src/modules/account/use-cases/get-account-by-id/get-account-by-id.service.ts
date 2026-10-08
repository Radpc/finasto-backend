import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountDomain } from '../../domain/account.domain';
import { AccountRepoService } from 'src/database/repositories/account/account-repo.service';

type Input = {
  accountId: string;
  requesterId: string;
};
type Output = AccountDomain;

@Injectable()
export class GetAccountByIdService {
  constructor(private readonly accountRepoService: AccountRepoService) {}

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepoService.getAccount({
      id: input.accountId,
      family: { users: { some: { id: input.requesterId } } },
    });

    if (!account) throw new NotFoundException();
    return account;
  }
}
