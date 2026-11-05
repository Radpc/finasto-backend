import { Injectable } from '@nestjs/common';
import { ListTimeBudgetsQuery } from './list-time-budgets.query';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { PaginatedList } from 'src/types/utils';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';

type Input = {
  familyId: string;
  query: ListTimeBudgetsQuery;
};
type Output = PaginatedList<TimeBudgetDomain>;

@Injectable()
export class ListTimeBudgetService {
  constructor(private readonly timeBudgetRepo: TimeBudgetRepoService) {}

  async execute({ familyId, query }: Input): Promise<Output> {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const res = await this.timeBudgetRepo.getTimeBudgets(familyId, {
      skip,
      take,
      where: {
        endDate: query.since ? { gte: query.since } : undefined,
        startDate: query.until ? { lte: query.until } : undefined,
      },
    });

    return res;
  }
}
