import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { TimeBudgetDomain } from 'src/modules/time-budget/domain/time-budget.domain';

type PaginatedList<T> = {
  data: T[];
  total: number;
};

@Injectable()
export class TimeBudgetRepoService {
  constructor(private prisma: PrismaService) {}

  async getTimeBudget(
    timebudgetWhereUniqueInput: Prisma.TimeBudgetWhereUniqueInput,
  ): Promise<TimeBudgetDomain | null> {
    const raw = await this.prisma.timeBudget.findUnique({
      where: timebudgetWhereUniqueInput,
      include: { category: true },
    });

    return raw ? TimeBudgetDomain.fromRaw(raw) : null;
  }

  async getTimeBudgets(params: {
    skip: number;
    take: number;
    cursor?: Prisma.TimeBudgetWhereUniqueInput;
    where?: Prisma.TimeBudgetWhereInput;
    orderBy?: Prisma.TimeBudgetOrderByWithRelationInput;
  }): Promise<PaginatedList<TimeBudgetDomain>> {
    const { skip, take, cursor, where, orderBy } = params;
    const [count, raws] = await this.prisma.$transaction([
      this.prisma.timeBudget.count({ where }),
      this.prisma.timeBudget.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        include: { category: true },
      }),
    ]);

    return {
      data: raws.map(TimeBudgetDomain.fromRaw),
      total: count,
    };
  }

  async createTimeBudget(
    data: Prisma.TimeBudgetCreateInput,
  ): Promise<TimeBudgetDomain> {
    const raw = await this.prisma.timeBudget.create({
      data,
      include: { category: true },
    });

    return TimeBudgetDomain.fromRaw(raw);
  }

  async updateTimeBudget(params: {
    where: Prisma.TimeBudgetWhereUniqueInput;
    data: Prisma.TimeBudgetUpdateInput;
  }): Promise<TimeBudgetDomain> {
    const { where, data } = params;
    const raw = await this.prisma.timeBudget.update({
      data,
      where,
    });
    return TimeBudgetDomain.fromRaw(raw);
  }

  async deleteTimeBudget(
    where: Prisma.TimeBudgetWhereUniqueInput,
  ): Promise<TimeBudgetDomain> {
    const raw = await this.prisma.timeBudget.delete({
      where,
    });
    return TimeBudgetDomain.fromRaw(raw);
  }
}
