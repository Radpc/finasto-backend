import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';
import { RemoveTimeBudgetService } from './remove-time-budget.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('time-budgets')
@ApiTags('Time budget')
export class RemoveTimeBudgetController {
  constructor(
    private readonly removeTimeBudgetService: RemoveTimeBudgetService,
  ) {}

  @Delete(':timeBudgetId')
  async handle(
    @FamilyId() familyId: string,
    @Param('timeBudgetId') timeBudgetId: string,
  ): ControllerResponse<TimeBudgetDTO> {
    const result = await this.removeTimeBudgetService.execute({
      familyId,
      timeBudgetId,
    });
    return result.toDTO();
  }
}
