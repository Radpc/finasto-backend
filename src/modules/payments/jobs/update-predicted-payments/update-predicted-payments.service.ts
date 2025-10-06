import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { PaymentStatus } from 'src/modules/payments/domain/payment.domain';

@Injectable()
export class UpdatePredictedPaymentsService {
  constructor(private paymentRepository: PaymentRepoService) {}

  @Cron('0 0 * * *')
  async execute() {
    const today = DateTime.now().endOf('day').toISO();

    await this.paymentRepository.updatePayments({
      data: { status: PaymentStatus.Paid },
      where: { status: PaymentStatus.Predicted, paymentDate: { lte: today } },
    });
  }
}
