import { Injectable, NotFoundException } from '@nestjs/common';
import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';

type Input = { requester: Requester; timeBudgetId: string };

type Output = {
  data: TimeBudgetDomain;
  message: 'Success';
};

@Injectable()
export class GetTimeBudgetByIdService {
  constructor(private timeBudgetRepo: TimeBudgetRepoService) {}
  async execute(input: Input): Promise<Output> {
    const res = await this.timeBudgetRepo.getTimeBudget({
      id: input.timeBudgetId,
      category: { family: { users: { some: { id: input.requester.userId } } } },
    });

    if (!res) throw new NotFoundException();

    return { data: res, message: 'Success' };
  }
}
