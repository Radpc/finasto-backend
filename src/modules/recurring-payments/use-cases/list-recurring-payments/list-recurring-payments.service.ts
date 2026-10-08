import { ListRecurringPaymentsQuery } from './list-recurring-payments.dto';
import { PaginatedList } from 'src/types/utils';
import { RecurringPaymentDomain } from '../../domain/recurring-payment.domain';
import { Injectable } from '@nestjs/common';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  query: ListRecurringPaymentsQuery;
  requester: UserDTO;
};
type Output = PaginatedList<RecurringPaymentDomain>;

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
          family: { users: { some: { id: requester.id } } },
        },
      },
      skip,
      take,
    });

    return res;
  }
}
