import { ListRecurringPaymentsQuery } from './list-recurring-payments.dto';
import { PaginatedList } from 'src/types/utils';
import { RecurringPaymentDomain } from '../../domain/recurring-payment.domain';
import { Injectable } from '@nestjs/common';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';

type Input = {
  familyId: string;
  query: ListRecurringPaymentsQuery;
};
type Output = PaginatedList<RecurringPaymentDomain>;

@Injectable()
export class ListRecurringPaymentsService {
  constructor(
    private readonly recurringPaymentRepoService: RecurringPaymentRepoService,
  ) {}

  async execute({ familyId, query }: Input): Promise<Output> {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const res = await this.recurringPaymentRepoService.getRecurringPayments(
      familyId,
      {
        where: { accountId: query.accountId },
        skip,
        take,
      },
    );

    return res;
  }
}
