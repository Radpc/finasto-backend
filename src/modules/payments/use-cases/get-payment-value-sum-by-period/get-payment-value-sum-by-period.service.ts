import { Injectable } from '@nestjs/common';
import { GetPaymentValueByPeriodQuery } from './get-payment-value-by-period.query';
import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { Prisma } from '@prisma/client';

type Input = {
  query: GetPaymentValueByPeriodQuery;
  requester: Requester;
};
type Output = {
  data: {
    gain: number;
    loss: number;
  };
  message: 'Success';
};

@Injectable()
export class GetPaymentValueSumByPeriodService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute({ query, requester }: Input): Promise<Output> {
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

    const res = await this.paymentRepoService.getPaymentValueSums({
      where: {
        account: {
          id: query.accountId,
          family: { users: { some: { id: requester.userId } } },
        },
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

    return { data: res, message: 'Success' };
  }
}
