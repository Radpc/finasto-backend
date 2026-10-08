import { RecurringPaymentDomain } from '../../domain/recurring-payment.domain';
import { CreateRecurringPaymentDTO } from '../../dto/create-recurring-payment.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException } from 'src/common/errors/app.exception';
import { ErrorCode } from 'src/common/errors/error-code';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';
import { Prisma } from '@prisma/client';
import { PaymentStatus } from 'src/modules/payments/domain/payment.domain';
import { DateTime } from 'luxon';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  payload: CreateRecurringPaymentDTO;
  requester: UserDTO;
};
type Output = RecurringPaymentDomain;

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

    if (!startDate.isValid) {
      throw new AppException(
        ErrorCode.InvalidDate,
        HttpStatus.BAD_REQUEST,
        'Invalid date',
      );
    }

    const currentDay = startDate.day;

    const paymentStartDate =
      currentDay < payload.dayOfMonth
        ? // This month
          startDate.set({ day: payload.dayOfMonth })
        : // Next month
          startDate.set({ day: payload.dayOfMonth }).plus({ month: 1 });

    const now = DateTime.now();
    const getPaidStatus = (date: DateTime) => {
      return now > date ? PaymentStatus.Paid : PaymentStatus.Predicted;
    };

    const payments: Prisma.PaymentCreateManyRecurringPaymentInput[] = [
      {
        accountId: payload.accountId,
        categoryId: payload.categoryId,
        description: payload.description,
        paymentMethod: payload.paymentMethod,
        status: payload.automaticPayment
          ? getPaidStatus(paymentStartDate)
          : PaymentStatus.Pending,
        userId: requester.id,
        value: payload.singlePaymentValue,
        paymentDate: paymentStartDate.set({ hour: 12 }).toISO(),
        observation: payload.numberOfInstallments
          ? `1/${payload.numberOfInstallments}`
          : undefined,
      },
    ];

    if (payload.numberOfInstallments) {
      [...Array.from({ length: payload.numberOfInstallments - 1 })].forEach(
        (_, i) => {
          const installmentNumber = i + 1;
          const newPaymentDate = paymentStartDate.plus({
            months: installmentNumber,
          });
          payments.push({
            accountId: payload.accountId,
            categoryId: payload.categoryId,
            description: payload.description,
            paymentMethod: payload.paymentMethod,
            status: payload.automaticPayment
              ? getPaidStatus(newPaymentDate)
              : PaymentStatus.Pending,
            userId: requester.id,
            value: payload.singlePaymentValue,
            paymentDate: newPaymentDate.set({ hour: 12 }).toISO(),
            observation: `${installmentNumber + 1}/${payload.numberOfInstallments}`,
          });
        },
      );
    } else {
      const dates: DateTime<true>[] = [];
      if (paymentStartDate.month === DateTime.now().month)
        dates.push(paymentStartDate.plus({ month: 1 }));

      dates.forEach((d) => {
        payments.push({
          accountId: payload.accountId,
          categoryId: payload.categoryId,
          description: payload.description,
          paymentMethod: payload.paymentMethod,
          status: payload.automaticPayment
            ? getPaidStatus(d)
            : PaymentStatus.Pending,
          userId: requester.id,
          value: payload.singlePaymentValue,
          paymentDate: d.set({ hour: 12 }).toISO(),
        });
      });
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
            family: { users: { some: { id: requester.id } } },
          },
        },
        automaticPayment: payload.automaticPayment,
        tags: {
          connect: payload.tagIds?.map((t) => ({
            id: t,
            family: { users: { some: { id: requester.id } } },
          })),
        },
        category: {
          connect: {
            id: payload.categoryId,
            family: { users: { some: { id: requester.id } } },
          },
        },
        createdBy: { connect: { id: requester.id } },
        payments: { createMany: { data: payments } },
      });

    return result;
  }
}
