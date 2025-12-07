import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { CreateRecurringPaymentService } from './create-recurring-payment.service';
import { CreateRecurringPaymentDTO } from '../../dto/create-recurring-payment.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('recurring-payments')
@ApiTags('Recurring Payment')
export class CreateRecurringPaymentController {
  constructor(
    private readonly createRecurringPaymentService: CreateRecurringPaymentService,
  ) {}

  @Post()
  async handle(
    @Body() payload: CreateRecurringPaymentDTO,
    @Req() req: AuthorizedRequest,
  ) {
    const res = await this.createRecurringPaymentService.execute({
      payload,
      requester: req.user,
    });
    return { data: res.data.toDTO(), message: 'Category created' };
  }
}
