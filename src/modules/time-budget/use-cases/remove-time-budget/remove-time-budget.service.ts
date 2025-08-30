import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';
import { NotFoundException } from '@nestjs/common';

type Input = {
  requester: Requester;
  timeBudgetId: string;
};
type Output = {
  data: TimeBudgetDomain;
  message: 'Success';
};

export class RemoveTimeBudgetService {
  constructor(private readonly timeBudgetRepo: TimeBudgetRepoService) {}

  async execute(input: Input): Promise<Output> {
    const res = await this.timeBudgetRepo.deleteTimeBudget({
      id: input.timeBudgetId,
      category: { family: { users: { some: { id: input.requester.userId } } } },
    });

    if (!res) throw new NotFoundException();
    return {
      data: res,
      message: 'Success',
    };
  }
}
