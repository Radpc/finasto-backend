import { Injectable, NotFoundException } from '@nestjs/common';
import { TimeBudgetDomain } from '../../domain/time-budget.domain';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = { requester: UserDTO; timeBudgetId: string };

type Output = TimeBudgetDomain;

@Injectable()
export class GetTimeBudgetByIdService {
  constructor(private timeBudgetRepo: TimeBudgetRepoService) {}
  async execute(input: Input): Promise<Output> {
    const res = await this.timeBudgetRepo.getTimeBudget({
      id: input.timeBudgetId,
      category: { family: { users: { some: { id: input.requester.id } } } },
    });

    if (!res) throw new NotFoundException();

    return res;
  }
}
