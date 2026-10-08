import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { CreatePaymentFromRecurringService } from './create-payment-from-recurring.service';
import { JobsTokenGuard } from 'src/common/guards/jobs-token.guard';

@UseGuards(JobsTokenGuard)
@ApiHeader({ name: 'x-jobs-token', required: true })
@Controller('jobs')
@ApiTags('Job')
export class CreatePaymentFromRecurringController {
  constructor(
    private readonly createPaymentFromRecurringService: CreatePaymentFromRecurringService,
  ) {}

  @Post('/create-payments-from-open-recurring')
  async handle() {
    await this.createPaymentFromRecurringService.execute();
  }
}
