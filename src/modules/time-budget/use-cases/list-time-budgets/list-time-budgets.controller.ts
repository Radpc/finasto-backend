import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListTimeBudgetsQuery } from './list-time-budgets.query';
import { ListTimeBudgetService } from './list-time-budgets.service';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { toPage } from 'src/common/pagination';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('time-budgets')
@ApiTags('Time budgets')
export class ListTimeBudgetsController {
  constructor(private readonly listTimeBudgetService: ListTimeBudgetService) {}

  @Get()
  async handle(
    @FamilyId() familyId: string,
    @Req() request: AuthorizedRequest,
    @Query() query: ListTimeBudgetsQuery,
  ): ControllerResponse<PaginatedResponse<TimeBudgetDTO>> {
    const res = await this.listTimeBudgetService.execute({
      familyId,
      query: query,
    });
    return toPage(
      res.data.map((b) => b.toDTO()),
      res.total,
      query,
    );
  }
}
