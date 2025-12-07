import { Injectable } from '@nestjs/common';
import { GetPaymentValueQuery } from './get-payment-value.query';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { Prisma } from '@prisma/client';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  query: GetPaymentValueQuery;
  requester: UserDTO;
};
type Output = {
  data: {
    gain: number;
    loss: number;
  };
  message: 'Success';
};

@Injectable()
export class GetPaymentValueSumService {
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
          family: { users: { some: { id: requester.id } } },
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
