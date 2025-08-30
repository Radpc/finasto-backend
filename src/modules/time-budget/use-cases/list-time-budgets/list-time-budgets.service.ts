import { Injectable } from '@nestjs/common';
import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { ListTimeBudgetsQuery } from './list-time-budgets.query';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { PaginatedList } from 'src/types/utils';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';

type Input = {
  requester: Requester;
  query: ListTimeBudgetsQuery;
};
type Output = {
  data: PaginatedList<TimeBudgetDomain>;
  message: 'Success';
};

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
          family: { users: { some: { id: requester.userId } } },
        },
        endDate: query.since ? { gte: query.since } : undefined,
        startDate: query.until ? { lte: query.until } : undefined,
      },
    });

    return { data: res, message: 'Success' };
  }
}
