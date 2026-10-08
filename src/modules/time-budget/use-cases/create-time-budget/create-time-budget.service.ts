import { Injectable } from '@nestjs/common';
import { CreateTimeBudgetDTO } from '../../dto/create-time-budget.dto';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  familyId: string;
  payload: CreateTimeBudgetDTO;
  requester: UserDTO;
};

type Output = TimeBudgetDomain;

@Injectable()
export class CreateTimeBudgetService {
  constructor(private timeBudgetRepo: TimeBudgetRepoService) {}

  async execute(input: Input): Promise<Output> {
    const payload = input.payload;
    return this.timeBudgetRepo.createTimeBudget(input.familyId, {
      startDate: payload.startDate,
      endDate: payload.endDate,
      budgetValue: payload.budgetValue,
      categoryId: payload.categoryId,
      createdBy: { connect: { id: input.requester.id } },
    });
  }
}
