import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { GetTimeBudgetByIdService } from './get-time-budget-by-id.service';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('time-budgets')
@ApiTags('Time budget')
export class GetTimeBudgetByIdController {
  constructor(
    private readonly getTimeBudgetByIdService: GetTimeBudgetByIdService,
  ) {}

  @Get(':timeBudgetId')
  async handle(
    @FamilyId() familyId: string,
    @Param('timeBudgetId') timeBudgetId: string,
  ): ControllerResponse<TimeBudgetDTO> {
    const result = await this.getTimeBudgetByIdService.execute({
      familyId,
      timeBudgetId,
    });
    return result.toDTO();
  }
}
