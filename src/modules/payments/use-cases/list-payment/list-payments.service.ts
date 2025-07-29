import { Injectable } from '@nestjs/common';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { GetPaymentsParams } from './list-payments.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListPaymentsService {
  constructor(private paymentRepository: PaymentRepoService) {}

  async execute(query: GetPaymentsParams) {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const res = await this.paymentRepository.getPayments({
      where: {
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
      skip,
      take,
      orderBy: { paymentDate: Prisma.SortOrder.desc },
    });

    return res;
  }
}
