import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { GetTimeBudgetByIdService } from './get-time-budget-by-id.service';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
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
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<TimeBudgetDTO> {
    const result = await this.getTimeBudgetByIdService.execute({
      timeBudgetId,
      requester: req.user,
    });
    return result.toDTO();
  }
}
