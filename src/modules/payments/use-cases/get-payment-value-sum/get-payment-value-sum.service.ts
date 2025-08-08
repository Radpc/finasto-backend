import { Injectable } from '@nestjs/common';
import { GetPaymentValueQuery } from './get-payment-value.query';
import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';

type Input = {
  query: GetPaymentValueQuery;
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
export class GetPaymentValueSumService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute({ query, requester }: Input): Promise<Output> {
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
        value: {
          gte: query.minValue,
          lte: query.maxValue,
        },
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
