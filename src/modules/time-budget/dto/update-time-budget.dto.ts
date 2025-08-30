import { PartialType } from '@nestjs/swagger';
import { CreateTimeBudgetDTO } from './create-time-budget.dto';

export class UpdateTimeBudgetDTO extends PartialType(CreateTimeBudgetDTO) {}
