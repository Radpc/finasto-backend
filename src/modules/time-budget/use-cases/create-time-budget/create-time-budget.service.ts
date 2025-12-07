import { Injectable } from '@nestjs/common';
import { CreateTimeBudgetDTO } from '../../dto/create-time-budget.dto';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  payload: CreateTimeBudgetDTO;
  requester: UserDTO;
};

type Output = {
  data: TimeBudgetDomain;
  message: 'Success';
};

@Injectable()
export class CreateTimeBudgetService {
  constructor(private timeBudgetRepo: TimeBudgetRepoService) {}

  async execute(input: Input): Promise<Output> {
    const payload = input.payload;
    const result = await this.timeBudgetRepo.createTimeBudget({
      startDate: payload.startDate,
      endDate: payload.endDate,
      budgetValue: payload.budgetValue,
      category: { connect: { id: payload.categoryId } },
      createdBy: { connect: { id: input.requester.id } },
    });

    return { data: result, message: 'Success' };
  }
}
