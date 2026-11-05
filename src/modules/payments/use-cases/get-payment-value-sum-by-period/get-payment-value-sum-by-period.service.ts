import { Injectable } from '@nestjs/common';
import { GetPaymentValueByPeriodQuery } from './get-payment-value-by-period.query';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  query: GetPaymentValueByPeriodQuery;
  requester: UserDTO;
  timezone: string;
};
type Output = {
  from: Date;
  total: number;
}[];

@Injectable()
export class GetPaymentValueSumByPeriodService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute({ query, requester, timezone }: Input): Promise<Output> {
    const res = await this.paymentRepoService.getPaymentValueSumsByPeriods({
      requesterId: requester.id,
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
    return res;
  }
}
