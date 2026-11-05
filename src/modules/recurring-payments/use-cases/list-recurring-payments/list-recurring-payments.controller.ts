import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListRecurringPaymentsService } from './list-recurring-payments.service';
import { ListRecurringPaymentsQuery } from './list-recurring-payments.dto';
import { toPage } from 'src/common/pagination';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('recurring-payments')
@ApiTags('Recurring Payment')
export class ListRecurringPaymentsController {
  constructor(
    private readonly listRecurringPaymentsService: ListRecurringPaymentsService,
  ) {}

  @Get()
  async handle(
    @FamilyId() familyId: string,
    @Query() query: ListRecurringPaymentsQuery,
  ) {
    const { data, total } = await this.listRecurringPaymentsService.execute({
      familyId,
      query,
    });
    return toPage(
      data.map((d) => d.toDTO()),
      total,
      query,
    );
  }
}
