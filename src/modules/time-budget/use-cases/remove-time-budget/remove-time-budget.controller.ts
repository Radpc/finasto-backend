import { Controller, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';
import { RemoveTimeBudgetService } from './remove-time-budget.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
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
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<TimeBudgetDTO> {
    const result = await this.removeTimeBudgetService.execute({
      timeBudgetId,
      requester: req.user,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
