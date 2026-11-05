import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { AppLogger } from 'src/modules/logger/providers/logger.service';
import { PaymentStatus } from 'src/modules/payments/domain/payment.domain';

@Injectable()
export class UpdatePredictedPaymentsService {
  constructor(
    private paymentRepository: PaymentRepoService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(UpdatePredictedPaymentsService.name);
  }

  @Cron('0 0 * * *')
  async execute() {
    const today = DateTime.now().endOf('day').toISO();

    const res = await this.paymentRepository.updatePaymentsAcrossFamilies({
      data: { status: PaymentStatus.Paid },
      where: { status: PaymentStatus.Predicted, paymentDate: { lte: today } },
    });

    this.logger.log(`Job executed - ${res.updated} payments updated`);
  }
}
