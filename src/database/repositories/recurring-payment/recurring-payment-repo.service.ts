import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { RecurringPaymentDomain } from 'src/modules/recurring-payments/domain/recurring-payment.domain';
import { PaginatedList } from 'src/types/utils';
import {
  connectInFamily,
  connectManyInFamily,
  familyScope,
  inScope,
  uniqueInScope,
} from '../../family-scope';

type CreateInput = Omit<
  Prisma.RecurringPaymentCreateInput,
  'account' | 'category' | 'tags'
> & { accountId: string; categoryId: string; tagIds?: string[] };

/**
 * Every method works inside one family, given as the first argument, except
 * the ones named "AcrossFamilies", which are for scheduled jobs.
 */
@Injectable()
export class RecurringPaymentRepoService {
  constructor(private prisma: PrismaService) {}

  async getRecurringPayment(
    familyId: string,
    options: {
      where: Prisma.RecurringPaymentWhereUniqueInput;
      include: Prisma.RecurringPaymentInclude;
    },
  ) {
    const raw = await this.prisma.recurringPayment.findUnique({
      where: uniqueInScope(
        options.where,
        familyScope.recurringPayment(familyId),
      ),
      include: options.include,
    });

    return raw ? RecurringPaymentDomain.fromRaw(raw) : null;
  }

  async getRecurringPayments(
    familyId: string,
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.RecurringPaymentWhereInput;
      orderBy?: Prisma.RecurringPaymentOrderByWithRelationInput;
    },
  ): Promise<PaginatedList<RecurringPaymentDomain>> {
    return this.findMany({
      ...params,
      where: inScope(params.where, familyScope.recurringPayment(familyId)),
    });
  }

  /** For scheduled jobs only: reads every family. */
  async getRecurringPaymentsAcrossFamilies(params: {
    where?: Prisma.RecurringPaymentWhereInput;
  }): Promise<PaginatedList<RecurringPaymentDomain>> {
    return this.findMany(params);
  }

  async createRecurringPayment(
    familyId: string,
    { accountId, categoryId, tagIds, ...data }: CreateInput,
  ): Promise<RecurringPaymentDomain> {
    const raw = await this.prisma.recurringPayment.create({
      data: {
        ...data,
        account: connectInFamily(familyId, accountId),
        category: connectInFamily(familyId, categoryId),
        tags: connectManyInFamily(familyId, tagIds ?? []),
      },
      include: { payments: true },
    });

    return RecurringPaymentDomain.fromRaw(raw);
  }

  private async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.RecurringPaymentWhereInput;
    orderBy?: Prisma.RecurringPaymentOrderByWithRelationInput;
  }): Promise<PaginatedList<RecurringPaymentDomain>> {
    const { skip, take, where, orderBy } = params;
    const [count, raws] = await this.prisma.$transaction([
      this.prisma.recurringPayment.count({ where }),
      this.prisma.recurringPayment.findMany({ skip, take, where, orderBy }),
    ]);

    return {
      data: raws.map(RecurringPaymentDomain.fromRaw),
      total: count,
    };
  }
}
