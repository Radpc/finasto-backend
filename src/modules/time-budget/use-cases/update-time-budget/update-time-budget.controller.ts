import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';
import { UpdateTimeBudgetService } from './update-time-budget.service';
import { UpdateTimeBudgetDTO } from '../../dto/update-time-budget.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('time-budgets')
@ApiTags('Time budget')
export class UpdateTimeBudgetController {
  constructor(
    private readonly updateTimeBudgetService: UpdateTimeBudgetService,
  ) {}

  @Patch(':timeBudgetId')
  async handle(
    @Param('timeBudgetId') timeBudgetId: string,
    @Req() req: UserRequest,
    @Body() payload: UpdateTimeBudgetDTO,
  ): ControllerResponse<TimeBudgetDTO> {
    const result = await this.updateTimeBudgetService.execute({
      timeBudgetId,
      requester: req.requester,
      payload,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
