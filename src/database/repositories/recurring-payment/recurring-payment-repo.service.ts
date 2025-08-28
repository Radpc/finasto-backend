import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { RecurringPaymentDomain } from 'src/modules/recurring-payments/domain/recurring-payment.domain';

type PaginatedList<T> = {
  data: T[];
  total: number;
};

@Injectable()
export class RecurringPaymentRepoService {
  constructor(private prisma: PrismaService) {}

  async getRecurringPayment(options: {
    where: Prisma.RecurringPaymentWhereUniqueInput;
    include: Prisma.RecurringPaymentInclude;
  }) {
    const raw = await this.prisma.recurringPayment.findUnique({
      where: options.where,
      include: options.include,
    });

    return raw ? RecurringPaymentDomain.fromRaw(raw) : null;
  }

  async getRecurringPayments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RecurringPaymentWhereUniqueInput;
    where?: Prisma.RecurringPaymentWhereInput;
    orderBy?: Prisma.RecurringPaymentOrderByWithRelationInput;
  }): Promise<PaginatedList<RecurringPaymentDomain>> {
    const { skip, take, cursor, where, orderBy } = params;
    const [count, raws] = await this.prisma.$transaction([
      this.prisma.recurringPayment.count({ where }),
      this.prisma.recurringPayment.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
    ]);

    return {
      data: raws.map(RecurringPaymentDomain.fromRaw),
      total: count,
    };
  }

  async createRecurringPayment(
    data: Prisma.RecurringPaymentCreateInput,
  ): Promise<RecurringPaymentDomain> {
    const raw = await this.prisma.recurringPayment.create({
      data,
      include: { payments: true },
    });

    return RecurringPaymentDomain.fromRaw(raw);
  }

  async updateRecurringPayment(params: {
    where: Prisma.RecurringPaymentWhereUniqueInput;
    data: Prisma.RecurringPaymentUpdateInput;
  }): Promise<RecurringPaymentDomain> {
    const { where, data } = params;
    const raw = await this.prisma.recurringPayment.update({
      data,
      where,
    });
    return RecurringPaymentDomain.fromRaw(raw);
  }

  async deleteRecurringPayment(
    where: Prisma.RecurringPaymentWhereUniqueInput,
  ): Promise<RecurringPaymentDomain> {
    const raw = await this.prisma.recurringPayment.delete({
      where,
    });
    return RecurringPaymentDomain.fromRaw(raw);
  }
}
