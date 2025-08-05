import { Controller, UseGuards, Req, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { GetRecurringPaymentByIdService } from './get-recurring-payment-by-id.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('recurring-payments')
@ApiTags('Recurring Payment')
export class GetRecurringPaymentByIdController {
  constructor(
    private readonly getRecurringPaymentByIdService: GetRecurringPaymentByIdService,
  ) {}

  @Get(':recurringPaymentId')
  async handle(
    @Param('recurringPaymentId') recurringPaymentId: string,
    @Req() req: UserRequest,
  ) {
    const res = await this.getRecurringPaymentByIdService.execute({
      requester: req.requester,
      recurringPaymentId: recurringPaymentId,
    });
    return { data: res.data.toDTO(), message: 'Category created' };
  }
}
