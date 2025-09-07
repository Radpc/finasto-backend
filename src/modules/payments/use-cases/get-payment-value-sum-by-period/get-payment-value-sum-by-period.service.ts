import { Injectable } from '@nestjs/common';
import {
  GetPaymentValueByPeriodQuery,
  PaymentValuePeriodType,
} from './get-payment-value-by-period.query';
import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';

type Input = {
  query: GetPaymentValueByPeriodQuery;
  requester: Requester;
  timezone: string;
};
type Output = {
  data: {
    from: Date;
    total: number;
  }[];
  message: 'Success';
};

@Injectable()
export class GetPaymentValueSumByPeriodService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute({ query, requester, timezone }: Input): Promise<Output> {
    const res = await this.paymentRepoService.getPaymentValueSumsByPeriods({
      requesterId: requester.userId,
      periodType: query.periodType,
      since: new Date(query.since),
      until: new Date(query.until),
      timezone: timezone,
      accountId: query.accountId,
      categoryId: query.categoryId,
      familyId: query.familyId,
      hasRecurringPayment: query.hasRecurringPayment,
      maxValue: query.maxValue,
      minValue: query.minValue,
      paymentMethod: query.paymentMethod,
      recurringPaymentId: query.recurringPaymentId,
      searchBy: query.searchBy,
      status: query.status,
      tagIds: query.tagIds,
    });
    return { data: res, message: 'Success' };
  }
}
