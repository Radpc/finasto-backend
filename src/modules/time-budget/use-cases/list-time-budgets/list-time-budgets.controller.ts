import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ListTimeBudgetsQuery } from './list-time-budgets.query';
import { ListTimeBudgetService } from './list-time-budgets.service';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('time-budgets')
@ApiTags('Time budgets')
export class ListTimeBudgetsController {
  constructor(private readonly listTimeBudgetService: ListTimeBudgetService) {}

  @Get()
  async handle(
    @Req() request: UserRequest,
    @Query() query: ListTimeBudgetsQuery,
  ): ControllerResponse<PaginatedResponse<TimeBudgetDTO>> {
    const res = await this.listTimeBudgetService.execute({
      query: query,
      requester: request.requester,
    });
    return {
      data: {
        items: res.data.data.map((b) => b.toDTO()),
        pagination: { page: query.page, total: res.data.total },
      },
      message: 'Payment created',
    };
  }
}
