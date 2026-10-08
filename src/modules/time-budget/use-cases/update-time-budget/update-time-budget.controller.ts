import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { TimeBudgetDTO } from '../../dto/time-budget.dto';
import { UpdateTimeBudgetService } from './update-time-budget.service';
import { UpdateTimeBudgetDTO } from '../../dto/update-time-budget.dto';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('time-budgets')
@ApiTags('Time budget')
export class UpdateTimeBudgetController {
  constructor(
    private readonly updateTimeBudgetService: UpdateTimeBudgetService,
  ) {}

  @Patch(':timeBudgetId')
  async handle(
    @FamilyId() familyId: string,
    @Param('timeBudgetId') timeBudgetId: string,
    @Body() payload: UpdateTimeBudgetDTO,
  ): ControllerResponse<TimeBudgetDTO> {
    const result = await this.updateTimeBudgetService.execute({
      familyId,
      timeBudgetId,
      payload,
    });
    return result.toDTO();
  }
}
