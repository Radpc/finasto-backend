import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';
import { PaymentStatus } from 'src/modules/payments/domain/payment.domain';

@Injectable()
export class CreatePaymentFromRecurringService {
  constructor(
    private readonly recurringPaymentRepoService: RecurringPaymentRepoService,
    private paymentRepository: PaymentRepoService,
  ) {}

  async updatePaymentsByMonth(monthDateISO: string) {
    const baseDate = DateTime.fromISO(monthDateISO);
    if (!baseDate.isValid) throw new InternalServerErrorException();

    const startOfMonth = baseDate.startOf('month');
    const endOfMonth = baseDate.endOf('month');

    // Get pending open recurring payments
    const { data: recurringPaymentsPending } =
      await this.recurringPaymentRepoService.getRecurringPayments({
        where: {
          numberOfInstallments: { equals: null },
          payments: {
            none: {
              paymentDate: {
                gte: startOfMonth.toISO(),
                lte: endOfMonth.toISO(),
              },
            },
          },
        },
      });

    const paymentPayloads: Prisma.PaymentCreateManyInput[] =
      recurringPaymentsPending.map((r) => ({
        accountId: r.accountId,
        categoryId: r.categoryId,
        description: r.description,
        paymentMethod: r.paymentMethod,
        status: r.automaticPayment
          ? PaymentStatus.Predicted
          : PaymentStatus.Pending,
        userId: r.createdById,
        value: r.singlePaymentValue,
        paymentDate: startOfMonth
          .set({ day: r.dayOfMonth, hour: 12, minute: 0, second: 0 })
          .toISO(),
        recurringPaymentId: r.id,
      }));

    // Create payments
    await this.paymentRepository.createPayments(paymentPayloads);
  }

  @Cron('@monthly')
  async execute() {
    // Do current month and the next one
    const monthsAhead = 2;

    const monthCounting = [
      ...Array.from({ length: monthsAhead }).map((_, i) => i),
    ];

    const now = DateTime.now();

    for (const m of monthCounting) {
      const monthDate = now.plus({ month: m });
      await this.updatePaymentsByMonth(monthDate.toISO());
    }
  }
}
