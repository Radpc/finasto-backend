import { Injectable } from '@nestjs/common';
import { ListAccountsQuery } from './list-accounts.dto';
import { PaginatedList } from 'src/types/utils';
import { AccountDomain } from '../../domain/account.domain';
import { AccountRepoService } from 'src/database/repositories/account/account-repo.service';

type Input = {
  familyId: string;
  query: ListAccountsQuery;
};
type Output = PaginatedList<AccountDomain>;

@Injectable()
export class ListAccountsService {
  constructor(private accountRepository: AccountRepoService) {}

  async execute(input: Input): Promise<Output> {
    const query = input.query;

    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const res = await this.accountRepository.getAccounts(input.familyId, {
      where: {
        name: query.searchBy ? { contains: query.searchBy } : undefined,
      },
      skip,
      take,
    });

    return res;
  }
}
