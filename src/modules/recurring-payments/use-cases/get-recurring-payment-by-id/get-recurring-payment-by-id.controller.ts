import { Controller, UseGuards, Req, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { GetRecurringPaymentByIdService } from './get-recurring-payment-by-id.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
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
    @Req() req: AuthorizedRequest,
  ) {
    const res = await this.getRecurringPaymentByIdService.execute({
      requester: req.user,
      recurringPaymentId: recurringPaymentId,
    });
    return { data: res.data.toDTO(), message: 'Category created' };
  }
}
