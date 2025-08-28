import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/modules/jwt/user-jwt/user.guard';
import { CreatePaymentFromRecurringService } from './create-payment-from-recurring.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('jobs')
@ApiTags('Job')
export class CreatePaymentFromRecurringController {
  constructor(
    private readonly createPaymentFromRecurringService: CreatePaymentFromRecurringService,
  ) {}

  @Post('/create-payments-from-open-recurring')
  async handle() {
    await this.createPaymentFromRecurringService.execute();
    return { data: null, message: 'Job executed' };
  }
}
