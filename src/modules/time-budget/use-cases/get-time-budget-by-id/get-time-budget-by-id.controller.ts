import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { GetTimeBudgetByIdService } from './get-time-budget-by-id.service';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('time-budgets')
@ApiTags('Time budget')
export class GetTimeBudgetByIdController {
  constructor(
    private readonly getTimeBudgetByIdService: GetTimeBudgetByIdService,
  ) {}

  @Get(':timeBudgetId')
  async handle(
    @Param('timeBudgetId') timeBudgetId: string,
    @Req() req: UserRequest,
  ): ControllerResponse<TimeBudgetDTO> {
    const result = await this.getTimeBudgetByIdService.execute({
      timeBudgetId,
      requester: req.requester,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
