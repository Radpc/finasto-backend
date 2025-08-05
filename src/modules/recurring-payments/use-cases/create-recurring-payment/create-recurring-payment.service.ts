import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { RecurringPaymentDomain } from '../../domain/recurring-payment.domain';
import { CreateRecurringPaymentDTO } from '../../dto/create-recurring-payment.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';
import { Prisma } from '@prisma/client';
import { PaymentStatus } from 'src/modules/payments/domain/payment.domain';
import { DateTime } from 'luxon';

type Input = {
  payload: CreateRecurringPaymentDTO;
  requester: Requester;
};
type Output = {
  data: RecurringPaymentDomain;
  message: 'Succcess';
};

@Injectable()
export class CreateRecurringPaymentService {
  constructor(
    private readonly recurringPaymentRepoService: RecurringPaymentRepoService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const { payload, requester } = input;

    const startDate = payload.startDateFrom
      ? DateTime.fromISO(payload.startDateFrom)
      : DateTime.now();

    if (!startDate.isValid) throw new BadRequestException('Invalid date');

    const currentDay = startDate.day;

    const paymentStartDate =
      currentDay < payload.dayOfMonth
        ? // This month
          startDate.set({ day: payload.dayOfMonth })
        : // Next month
          startDate.set({ day: payload.dayOfMonth }).plus({ month: 1 });

    const payments: Prisma.PaymentCreateManyRecurringPaymentInput[] = [
      {
        accountId: payload.accountId,
        categoryId: payload.categoryId,
        description: payload.description,
        paymentMethod: payload.paymentMethod,
        status: payload.automaticPayment
          ? PaymentStatus.Paid
          : PaymentStatus.Pending,
        userId: requester.userId,
        value: payload.singlePaymentValue,
        paymentDate: paymentStartDate.toISO(),
        observation: payload.numberOfInstallments
          ? `1/${payload.numberOfInstallments}`
          : undefined,
      },
    ];

    if (payload.numberOfInstallments) {
      [...Array.from({ length: payload.numberOfInstallments - 1 })].forEach(
        (_, i) => {
          const installmentNumber = i + 1;
          const newPaymentDate = paymentStartDate
            .plus({
              months: installmentNumber,
            })
            .toISO();

          payments.push({
            accountId: payload.accountId,
            categoryId: payload.categoryId,
            description: payload.description,
            paymentMethod: payload.paymentMethod,
            status: payload.automaticPayment
              ? PaymentStatus.Paid
              : PaymentStatus.Pending,
            userId: requester.userId,
            value: payload.singlePaymentValue,
            paymentDate: newPaymentDate,
            observation: `${installmentNumber + 1}/${payload.numberOfInstallments}`,
          });
        },
      );
    }

    const result =
      await this.recurringPaymentRepoService.createRecurringPayment({
        description: payload.description,
        dayOfMonth: payload.dayOfMonth,
        paymentMethod: payload.paymentMethod,
        singlePaymentValue: payload.singlePaymentValue,
        numberOfInstallments: payload.numberOfInstallments,
        totalValue: payload.totalValue,
        account: {
          connect: {
            id: payload.accountId,
            family: { users: { some: { id: requester.userId } } },
          },
        },
        automaticPayment: payload.automaticPayment,
        tags: {
          connect: payload.tagIds?.map((t) => ({
            id: t,
            family: { users: { some: { id: requester.userId } } },
          })),
        },
        category: {
          connect: {
            id: payload.categoryId,
            family: { users: { some: { id: requester.userId } } },
          },
        },
        createdBy: { connect: { id: requester.userId } },
        payments: { createMany: { data: payments } },
      });

    return { data: result, message: 'Succcess' };
  }
}
