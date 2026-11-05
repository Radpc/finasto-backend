import { Injectable } from '@nestjs/common';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { ListPaymentsQuery } from './list-payments.dto';
import { Prisma } from '@prisma/client';
import { PaymentDomain } from '../../domain/payment.domain';
import { PaginatedList } from 'src/types/utils';

type Input = {
  familyId: string;
  query: ListPaymentsQuery;
};
type Output = PaginatedList<PaymentDomain>;

@Injectable()
export class ListPaymentsService {
  constructor(private paymentRepository: PaymentRepoService) {}

  async execute({ familyId, query }: Input): Promise<Output> {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

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

    const res = await this.paymentRepository.getPayments(familyId, {
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
      skip,
      take,
      orderBy: { paymentDate: Prisma.SortOrder.desc },
      include: {
        category: true,
        tags: true,
        account: true,
        recurringPayment: true,
      },
    });

    return res;
  }
}
