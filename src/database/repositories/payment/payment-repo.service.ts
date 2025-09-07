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

@Injectable()
export class PaymentRepoService {
  constructor(private prisma: PrismaService) {}

  async getPayment(options: {
    where: Prisma.PaymentWhereUniqueInput;
    include?: Prisma.PaymentInclude<DefaultArgs>;
  }): Promise<PaymentDomain | null> {
    const raw = await this.prisma.payment.findUnique({
      where: options.where,
      include: options.include,
    });

    return raw ? PaymentDomain.fromRaw(raw) : null;
  }

  async getPaymentValueSums({ where }: { where?: Prisma.PaymentWhereInput }) {
    const gains = this.prisma.payment.aggregate({
      where: { ...where, AND: [{ value: { gte: 0 } }] },
      _sum: { value: true },
    });

    const losses = this.prisma.payment.aggregate({
      where: { ...where, AND: [{ value: { lte: 0 } }] },
      _sum: { value: true },
    });

    const [gainRes, lossRes] = await this.prisma.$transaction([gains, losses]);

    return {
      gain: gainRes._sum.value || 0,
      loss: lossRes._sum.value || 0,
    };
  }

  async getPaymentValueSumsByPeriods(
    query: IGetPaymentValueSymsByPeriodsQuery & { requesterId: string },
  ): Promise<{ from: Date; total: number }[]> {
    const generatedQuery = getPaymentValueSumsByPeriodsSQL({ query });
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

  async getPayments(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PaymentWhereUniqueInput;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput;
    include?: Prisma.PaymentInclude<DefaultArgs>;
  }): Promise<PaginatedList<PaymentDomain>> {
    const { skip, take, cursor, where, orderBy, include } = params;

    const query = {
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    } satisfies Prisma.PaymentFindManyArgs;

    const [raws, count] = await this.prisma.$transaction([
      this.prisma.payment.findMany(query),
      this.prisma.payment.count({ where: query.where }),
    ]);

    return { data: raws.map(PaymentDomain.fromRaw), total: count };
  }

  async createPayment(data: Prisma.PaymentCreateInput): Promise<PaymentDomain> {
    const raw = await this.prisma.payment.create({
      data,
    });

    return PaymentDomain.fromRaw(raw);
  }

  async createPayments(
    data: Prisma.PaymentCreateManyInput[],
  ): Promise<PaymentDomain[]> {
    const raw = await this.prisma.$transaction(
      data.map((d) => this.prisma.payment.create({ data: d })),
    );
    return raw.map(PaymentDomain.fromRaw);
  }

  async updatePayment(params: {
    where: Prisma.PaymentWhereUniqueInput;
    data: Prisma.PaymentUpdateInput;
  }): Promise<PaymentDomain> {
    const { where, data } = params;

    const raw = await this.prisma.payment.update({
      data,
      where,
    });
    return PaymentDomain.fromRaw(raw);
  }

  async updatePayments(params: {
    where: Prisma.PaymentWhereInput;
    data: Prisma.PaymentUpdateInput;
  }): Promise<{ updated: number }> {
    const { where, data } = params;

    const raw = await this.prisma.payment.updateMany({
      data,
      where,
    });

    return { updated: raw.count };
  }

  async deletePayment(
    where: Prisma.PaymentWhereUniqueInput,
  ): Promise<PaymentDomain> {
    const raw = await this.prisma.payment.delete({
      where,
    });

    return PaymentDomain.fromRaw(raw);
  }
}
