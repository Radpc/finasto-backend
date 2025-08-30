import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';
import { RemoveTimeBudgetService } from './remove-time-budget.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('time-budgets')
@ApiTags('Time budget')
export class RemoveTimeBudgetController {
  constructor(
    private readonly removeTimeBudgetService: RemoveTimeBudgetService,
  ) {}

  @Delete(':timeBudgetId')
  async handle(
    @Param('timeBudgetId') timeBudgetId: string,
    @Req() req: UserRequest,
  ): ControllerResponse<TimeBudgetDTO> {
    const result = await this.removeTimeBudgetService.execute({
      timeBudgetId,
      requester: req.requester,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
