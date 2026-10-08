import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';

type Input = { familyId: string; timeBudgetId: string };

type Output = TimeBudgetDomain;

@Injectable()
export class GetTimeBudgetByIdService {
  constructor(private timeBudgetRepo: TimeBudgetRepoService) {}
  async execute(input: Input): Promise<Output> {
    const res = await this.timeBudgetRepo.getTimeBudget(input.familyId, {
      id: input.timeBudgetId,
    });

    if (!res) throw new NotFoundException();

    return res;
  }
}
