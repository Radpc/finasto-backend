import { Injectable } from '@nestjs/common';
import { GetPaymentValueByPeriodQuery } from './get-payment-value-by-period.query';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';

type Input = {
  familyId: string;
  query: GetPaymentValueByPeriodQuery;
  timezone: string;
};
type Output = {
  from: Date;
  total: number;
}[];

@Injectable()
export class GetPaymentValueSumByPeriodService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute({ familyId, query, timezone }: Input): Promise<Output> {
    const res = await this.paymentRepoService.getPaymentValueSumsByPeriods(
      familyId,
      {
        periodType: query.periodType,
        since: new Date(query.since),
        until: new Date(query.until),
        timezone: timezone,
        accountId: query.accountId,
        categoryId: query.categoryId,
        hasRecurringPayment: query.hasRecurringPayment,
        maxValue: query.maxValue,
        minValue: query.minValue,
        paymentMethod: query.paymentMethod,
        recurringPaymentId: query.recurringPaymentId,
        searchBy: query.searchBy,
        status: query.status,
        tagIds: query.tagIds,
      },
    );
    return res;
  }
}
