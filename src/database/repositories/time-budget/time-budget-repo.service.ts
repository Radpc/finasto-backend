import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { TimeBudgetDomain } from 'src/modules/time-budget/domain/time-budget.domain';
import { PaginatedList } from 'src/types/utils';
import {
  connectInFamily,
  familyScope,
  inScope,
  uniqueInScope,
} from '../../family-scope';

/** Every method works inside one family, given as the first argument. */
@Injectable()
export class TimeBudgetRepoService {
  constructor(private prisma: PrismaService) {}

  async getTimeBudget(
    familyId: string,
    where: Prisma.TimeBudgetWhereUniqueInput,
  ): Promise<TimeBudgetDomain | null> {
    const raw = await this.prisma.timeBudget.findUnique({
      where: uniqueInScope(where, familyScope.timeBudget(familyId)),
      include: { category: true },
    });

    return raw ? TimeBudgetDomain.fromRaw(raw) : null;
  }

  async getTimeBudgets(
    familyId: string,
    params: {
      skip: number;
      take: number;
      where?: Prisma.TimeBudgetWhereInput;
      orderBy?: Prisma.TimeBudgetOrderByWithRelationInput;
    },
  ): Promise<PaginatedList<TimeBudgetDomain>> {
    const { skip, take, orderBy } = params;
    const where = inScope(params.where, familyScope.timeBudget(familyId));
    const [count, raws] = await this.prisma.$transaction([
      this.prisma.timeBudget.count({ where }),
      this.prisma.timeBudget.findMany({
        skip,
        take,
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
    familyId: string,
    {
      categoryId,
      ...data
    }: Omit<Prisma.TimeBudgetCreateInput, 'category'> & { categoryId: string },
  ): Promise<TimeBudgetDomain> {
    const raw = await this.prisma.timeBudget.create({
      data: { ...data, category: connectInFamily(familyId, categoryId) },
      include: { category: true },
    });

    return TimeBudgetDomain.fromRaw(raw);
  }

  async updateTimeBudget(
    familyId: string,
    params: {
      where: Prisma.TimeBudgetWhereUniqueInput;
      data: Omit<Prisma.TimeBudgetUpdateInput, 'category'> & {
        categoryId?: string;
      };
    },
  ): Promise<TimeBudgetDomain> {
    const { categoryId, ...data } = params.data;
    const raw = await this.prisma.timeBudget.update({
      data: {
        ...data,
        category: categoryId
          ? connectInFamily(familyId, categoryId)
          : undefined,
      },
      where: uniqueInScope(params.where, familyScope.timeBudget(familyId)),
    });
    return TimeBudgetDomain.fromRaw(raw);
  }

  async deleteTimeBudget(
    familyId: string,
    where: Prisma.TimeBudgetWhereUniqueInput,
  ): Promise<TimeBudgetDomain> {
    const raw = await this.prisma.timeBudget.delete({
      where: uniqueInScope(where, familyScope.timeBudget(familyId)),
    });
    return TimeBudgetDomain.fromRaw(raw);
  }
}
