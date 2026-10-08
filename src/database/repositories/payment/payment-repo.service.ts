import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { PaymentDomain } from 'src/modules/payments/domain/payment.domain';
import { PaginatedList } from 'src/types/utils';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PaymentValuePeriodType } from 'src/modules/payments/use-cases/get-payment-value-sum-by-period/get-payment-value-by-period.query';
import {
  getPaymentValueSumsByPeriodsSQL,
  IGetPaymentValueSumsByPeriodsResponse,
  IGetPaymentValueSymsByPeriodsQuery,
  IResultByDay,
  IResultByMonth,
  IResultByWeek,
  IResultByYear,
} from './sql/getPaymentValueSumsByPeriods';
import { DateTime } from 'luxon';
import {
  connectInFamily,
  connectManyInFamily,
  familyScope,
  inScope,
  uniqueInScope,
} from '../../family-scope';

type CreateInput = Omit<
  Prisma.PaymentCreateInput,
  'account' | 'category' | 'tags'
> & { accountId: string; categoryId: string; tagIds?: string[] };

type UpdateInput = Omit<Prisma.PaymentUpdateInput, 'category' | 'tags'> & {
  categoryId?: string;
  tagIds?: string[];
};

/**
 * Every method works inside one family, given as the first argument, except
 * the ones named "AcrossFamilies", which are for scheduled jobs.
 */
@Injectable()
export class PaymentRepoService {
  constructor(private prisma: PrismaService) {}

  async getPayment(
    familyId: string,
    options: {
      where: Prisma.PaymentWhereUniqueInput;
      include?: Prisma.PaymentInclude<DefaultArgs>;
    },
  ): Promise<PaymentDomain | null> {
    const raw = await this.prisma.payment.findUnique({
      where: uniqueInScope(options.where, familyScope.payment(familyId)),
      include: options.include,
    });

    return raw ? PaymentDomain.fromRaw(raw) : null;
  }

  async getPaymentValueSums(
    familyId: string,
    params: { where?: Prisma.PaymentWhereInput },
  ) {
    const where = inScope(params.where, familyScope.payment(familyId));
    const gains = this.prisma.payment.aggregate({
      where: { AND: [where, { value: { gte: 0 } }] },
      _sum: { value: true },
    });

    const losses = this.prisma.payment.aggregate({
      where: { AND: [where, { value: { lte: 0 } }] },
      _sum: { value: true },
    });

    const [gainRes, lossRes] = await this.prisma.$transaction([gains, losses]);

    return {
      gain: gainRes._sum.value || 0,
      loss: lossRes._sum.value || 0,
    };
  }

  async getPaymentValueSumsByPeriods(
    familyId: string,
    query: IGetPaymentValueSymsByPeriodsQuery,
  ): Promise<{ from: Date; total: number }[]> {
    const generatedQuery = getPaymentValueSumsByPeriodsSQL({ familyId, query });
    const res: IGetPaymentValueSumsByPeriodsResponse =
      await this.prisma.$queryRaw(generatedQuery);

    switch (query.periodType) {
      case PaymentValuePeriodType.Daily:
        return (res as IResultByDay[]).map((r) => {
          return {
            from: DateTime.local({ zone: query.timezone })
              .set({
                day: r.localDay,
                month: r.localMonth,
                year: r.localYear,
              })
              .startOf('day')
              .toJSDate(),
            total: r.sum,
          };
        });

      case PaymentValuePeriodType.Weekly:
        return (res as IResultByWeek[]).map((r) => {
          return {
            from: DateTime.local({ zone: query.timezone })
              .set({
                weekNumber: r.localWeek,
                weekYear: r.localYear,
              })
              .startOf('week')
              .toJSDate(),
            total: r.sum,
          };
        });

      case PaymentValuePeriodType.Monthly:
        return (res as IResultByMonth[]).map((r) => {
          return {
            from: DateTime.local({ zone: query.timezone })
              .set({
                month: r.localMonth,
                year: r.localYear,
              })
              .startOf('month')
              .toJSDate(),
            total: r.sum,
          };
        });

      case PaymentValuePeriodType.Yearly:
        return (res as IResultByYear[]).map((r) => {
          return {
            from: DateTime.local({ zone: query.timezone })
              .set({
                year: r.localYear,
              })
              .startOf('year')
              .toJSDate(),
            total: r.sum,
          };
        });
    }
  }

  async getPayments(
    familyId: string,
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.PaymentWhereInput;
      orderBy?: Prisma.PaymentOrderByWithRelationInput;
      include?: Prisma.PaymentInclude<DefaultArgs>;
    },
  ): Promise<PaginatedList<PaymentDomain>> {
    const { skip, take, orderBy, include } = params;
    const where = inScope(params.where, familyScope.payment(familyId));

    const [raws, count] = await this.prisma.$transaction([
      this.prisma.payment.findMany({ skip, take, where, orderBy, include }),
      this.prisma.payment.count({ where }),
    ]);

    return { data: raws.map(PaymentDomain.fromRaw), total: count };
  }

  async createPayment(
    familyId: string,
    { accountId, categoryId, tagIds, ...data }: CreateInput,
  ): Promise<PaymentDomain> {
    const raw = await this.prisma.payment.create({
      data: {
        ...data,
        account: connectInFamily(familyId, accountId),
        category: connectInFamily(familyId, categoryId),
        tags: connectManyInFamily(familyId, tagIds ?? []),
      },
    });

    return PaymentDomain.fromRaw(raw);
  }

  async updatePayment(
    familyId: string,
    params: {
      where: Prisma.PaymentWhereUniqueInput;
      data: UpdateInput;
    },
  ): Promise<PaymentDomain> {
    const { categoryId, tagIds, ...data } = params.data;

    const raw = await this.prisma.payment.update({
      data: {
        ...data,
        category: categoryId
          ? connectInFamily(familyId, categoryId)
          : undefined,
        tags: tagIds ? connectManyInFamily(familyId, tagIds) : undefined,
      },
      where: uniqueInScope(params.where, familyScope.payment(familyId)),
    });
    return PaymentDomain.fromRaw(raw);
  }

  async deletePayment(
    familyId: string,
    where: Prisma.PaymentWhereUniqueInput,
  ): Promise<PaymentDomain> {
    const raw = await this.prisma.payment.delete({
      where: uniqueInScope(where, familyScope.payment(familyId)),
    });

    return PaymentDomain.fromRaw(raw);
  }

  /** For scheduled jobs only: writes payments of any family. */
  async createPaymentsAcrossFamilies(
    data: Prisma.PaymentCreateManyInput[],
  ): Promise<PaymentDomain[]> {
    const raw = await this.prisma.$transaction(
      data.map((d) => this.prisma.payment.create({ data: d })),
    );
    return raw.map(PaymentDomain.fromRaw);
  }

  /** For scheduled jobs only: updates payments of any family. */
  async updatePaymentsAcrossFamilies(params: {
    where: Prisma.PaymentWhereInput;
    data: Prisma.PaymentUpdateManyMutationInput;
  }): Promise<{ updated: number }> {
    const raw = await this.prisma.payment.updateMany(params);
    return { updated: raw.count };
  }
}
