import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePaymentFromRecurringService } from './create-payment-from-recurring.service';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';

@UseGuards(ApiKeyAndJwtGuard)
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
