import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';
import { NotFoundException } from '@nestjs/common';

type Input = {
  familyId: string;
  timeBudgetId: string;
};
type Output = TimeBudgetDomain;

export class RemoveTimeBudgetService {
  constructor(private readonly timeBudgetRepo: TimeBudgetRepoService) {}

  async execute(input: Input): Promise<Output> {
    const res = await this.timeBudgetRepo.deleteTimeBudget(input.familyId, {
      id: input.timeBudgetId,
    });

    if (!res) throw new NotFoundException();
    return res;
  }
}
