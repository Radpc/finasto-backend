import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';
import {
  PaymentDomain,
  PaymentStatus,
} from 'src/modules/payments/domain/payment.domain';
import { CreatePaymentService } from 'src/modules/payments/use-cases/create-payment/create-payment.service';

const logger = new Logger(CreatePaymentService.name);

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
    const res = await this.paymentRepository.createPayments(paymentPayloads);
    return res;
  }

  @Cron('0 0 1 * *')
  async execute() {
    // Do current month and the next one
    const monthsAhead = 2;

    const monthCounting = [
      ...Array.from({ length: monthsAhead }).map((_, i) => i),
    ];

    const now = DateTime.now();
    const totalCreatedPayments: PaymentDomain[] = [];
    for (const m of monthCounting) {
      const monthDate = now.plus({ month: m });
      const createdPayments = await this.updatePaymentsByMonth(
        monthDate.toISO(),
      );
      totalCreatedPayments.push(...createdPayments);
    }

    logger.log(
      `Executed create-payment-from-recurring job. ${totalCreatedPayments.length} payments created `,
    );
  }
}
