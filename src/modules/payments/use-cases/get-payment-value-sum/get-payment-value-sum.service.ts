import { Injectable } from '@nestjs/common';
import { GetPaymentValueQuery } from './get-payment-value.query';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { Prisma } from '@prisma/client';

type Input = {
  familyId: string;
  query: GetPaymentValueQuery;
};
type Output = {
  gain: number;
  loss: number;
};

@Injectable()
export class GetPaymentValueSumService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute({ familyId, query }: Input): Promise<Output> {
    let recurringPaymentWhere:
      | Prisma.RecurringPaymentWhereInput
      | null
      | undefined;

    if (query.hasRecurringPayment === false) {
      recurringPaymentWhere = null;
    } else if (query.recurringPaymentId) {
      recurringPaymentWhere = { id: query.recurringPaymentId };
    } else if (query.hasRecurringPayment === true) {
      recurringPaymentWhere = { id: {} };
    }

    const res = await this.paymentRepoService.getPaymentValueSums(familyId, {
      where: {
        accountId: query.accountId,
        categoryId: query.categoryId,
        status: query.status,
        tags: query.tagIds ? { some: { id: { in: query.tagIds } } } : undefined,
        paymentDate: {
          gte: query.since ? new Date(query.since) : undefined,
          lte: query.until ? new Date(query.until) : undefined,
        },
        paymentMethod: query.paymentMethod,
        value: {
          gte: query.minValue,
          lte: query.maxValue,
        },
        recurringPayment: recurringPaymentWhere,
        OR: query.searchBy
          ? [
              { description: { contains: query.searchBy } },
              { observation: { contains: query.searchBy } },
            ]
          : undefined,
      },
    });

    return res;
  }
}
