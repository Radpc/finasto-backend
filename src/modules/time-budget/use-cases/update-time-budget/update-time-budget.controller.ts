import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';
import { UpdateTimeBudgetService } from './update-time-budget.service';
import { UpdateTimeBudgetDTO } from '../../dto/update-time-budget.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
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
    @Req() req: AuthorizedRequest,
    @Body() payload: UpdateTimeBudgetDTO,
  ): ControllerResponse<TimeBudgetDTO> {
    const result = await this.updateTimeBudgetService.execute({
      timeBudgetId,
      requester: req.user,
      payload,
    });
    return result.toDTO();
  }
}
