import { UpdateTimeBudgetDTO } from '../../dto/update-time-budget.dto';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  requester: UserDTO;
  timeBudgetId: string;
  payload: UpdateTimeBudgetDTO;
};

type Output = {
  message: 'Success';
  data: TimeBudgetDomain;
};

@Injectable()
export class UpdateTimeBudgetService {
  constructor(private readonly timeBudgetRepo: TimeBudgetRepoService) {}

  async execute(input: Input): Promise<Output> {
    const { payload, requester, timeBudgetId } = input;
    const res = await this.timeBudgetRepo.updateTimeBudget({
      where: {
        id: timeBudgetId,
        category: {
          family: { users: { some: { id: requester.id } } },
        },
      },
      data: {
        budgetValue: payload.budgetValue ?? undefined,
        category: payload.categoryId
          ? {
              connect: {
                id: payload.categoryId,
                family: { users: { some: { id: requester.id } } },
              },
            }
          : undefined,
        startDate: payload.startDate ?? undefined,
        endDate: payload.endDate ?? undefined,
      },
    });

    if (!res) throw new NotFoundException();
    return { data: res, message: 'Success' };
  }
}
