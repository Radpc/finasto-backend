import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { ListRecurringPaymentsQuery } from './list-recurring-payments.dto';
import { PaginatedList } from 'src/types/utils';
import { RecurringPaymentDomain } from '../../domain/recurring-payment.domain';
import { Injectable } from '@nestjs/common';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';

type Input = {
  query: ListRecurringPaymentsQuery;
  requester: Requester;
};
type Output = {
  data: PaginatedList<RecurringPaymentDomain>;
  message: 'Success';
};

@Injectable()
export class ListRecurringPaymentsService {
  constructor(
    private readonly recurringPaymentRepoService: RecurringPaymentRepoService,
  ) {}

  async execute({ query, requester }: Input): Promise<Output> {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const res = await this.recurringPaymentRepoService.getRecurringPayments({
      where: {
        account: {
          id: query.accountId,
          family: { users: { some: { id: requester.userId } } },
        },
      },
      skip,
      take,
    });

    return { data: res, message: 'Success' };
  }
}
