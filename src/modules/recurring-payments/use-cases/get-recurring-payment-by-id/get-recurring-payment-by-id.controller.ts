import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetRecurringPaymentByIdService } from './get-recurring-payment-by-id.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('recurring-payments')
@ApiTags('Recurring Payment')
export class GetRecurringPaymentByIdController {
  constructor(
    private readonly getRecurringPaymentByIdService: GetRecurringPaymentByIdService,
  ) {}

  @Get(':recurringPaymentId')
  async handle(
    @FamilyId() familyId: string,
    @Param('recurringPaymentId') recurringPaymentId: string,
  ) {
    const res = await this.getRecurringPaymentByIdService.execute({
      familyId,
      recurringPaymentId: recurringPaymentId,
    });
    return res.toDTO();
  }
}
