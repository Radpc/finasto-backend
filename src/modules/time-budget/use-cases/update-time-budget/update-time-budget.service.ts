import { UpdateTimeBudgetDTO } from '../../dto/update-time-budget.dto';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';

type Input = {
  familyId: string;
  timeBudgetId: string;
  payload: UpdateTimeBudgetDTO;
};

type Output = TimeBudgetDomain;

@Injectable()
export class UpdateTimeBudgetService {
  constructor(private readonly timeBudgetRepo: TimeBudgetRepoService) {}

  async execute(input: Input): Promise<Output> {
    const { familyId, payload, timeBudgetId } = input;
    const res = await this.timeBudgetRepo.updateTimeBudget(familyId, {
      where: { id: timeBudgetId },
      data: {
        budgetValue: payload.budgetValue ?? undefined,
        categoryId: payload.categoryId ?? undefined,
        startDate: payload.startDate ?? undefined,
        endDate: payload.endDate ?? undefined,
      },
    });

    if (!res) throw new NotFoundException();
    return res;
  }
}
