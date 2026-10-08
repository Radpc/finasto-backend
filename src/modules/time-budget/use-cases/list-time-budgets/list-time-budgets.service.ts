import { Injectable } from '@nestjs/common';
import { ListTimeBudgetsQuery } from './list-time-budgets.query';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { PaginatedList } from 'src/types/utils';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  requester: UserDTO;
  query: ListTimeBudgetsQuery;
};
type Output = PaginatedList<TimeBudgetDomain>;

@Injectable()
export class ListTimeBudgetService {
  constructor(private readonly timeBudgetRepo: TimeBudgetRepoService) {}

  async execute({ query, requester }: Input): Promise<Output> {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const res = await this.timeBudgetRepo.getTimeBudgets({
      skip,
      take,
      where: {
        category: {
          family: { users: { some: { id: requester.id } } },
        },
        endDate: query.since ? { gte: query.since } : undefined,
        startDate: query.until ? { lte: query.until } : undefined,
      },
    });

    return res;
  }
}
