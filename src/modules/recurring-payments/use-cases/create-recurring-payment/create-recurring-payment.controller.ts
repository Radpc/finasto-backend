import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { CreateRecurringPaymentService } from './create-recurring-payment.service';
import { CreateRecurringPaymentDTO } from '../../dto/create-recurring-payment.dto';

@UseGuards(UserGuard)
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
    @Req() req: UserRequest,
  ) {
    const res = await this.createRecurringPaymentService.execute({
      payload,
      requester: req.requester,
    });
    return { data: res.data.toDTO(), message: 'Category created' };
  }
}
