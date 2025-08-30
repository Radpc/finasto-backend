import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { CreateTimeBudgetController } from './use-cases/create-time-budget/create-time-budget.controller';
import { GetTimeBudgetByIdController } from './use-cases/get-time-budget-by-id/get-time-budget-by-id.controller';
import { ListTimeBudgetsController } from './use-cases/list-time-budgets/list-time-budgets.controller';
import { RemoveTimeBudgetController } from './use-cases/remove-time-budget/remove-time-budget.controller';
import { UpdateTimeBudgetController } from './use-cases/update-time-budget/update-time-budget.controller';
import { TimeBudgetRepoService } from 'src/database/repositories/time-budget/time-budget-repo.service';
import { CreateTimeBudgetService } from './use-cases/create-time-budget/create-time-budget.service';
import { GetTimeBudgetByIdService } from './use-cases/get-time-budget-by-id/get-time-budget-by-id.service';
import { ListTimeBudgetService } from './use-cases/list-time-budgets/list-time-budgets.service';
import { RemoveTimeBudgetService } from './use-cases/remove-time-budget/remove-time-budget.service';
import { UpdateTimeBudgetService } from './use-cases/update-time-budget/update-time-budget.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateTimeBudgetController,
    GetTimeBudgetByIdController,
    ListTimeBudgetsController,
    RemoveTimeBudgetController,
    UpdateTimeBudgetController,
  ],
  providers: [
    CreateTimeBudgetService,
    GetTimeBudgetByIdService,
    ListTimeBudgetService,
    RemoveTimeBudgetService,
    UpdateTimeBudgetService,

    // Repos
    TimeBudgetRepoService,
  ],
})
export class TimeBudgetModule {}
