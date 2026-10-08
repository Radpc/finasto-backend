import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { CategoryDomain } from 'src/modules/category/domain/category.domain';
import { PaginatedList } from 'src/types/utils';
import { familyScope, inScope, uniqueInScope } from '../../family-scope';

/** Every method works inside one family, given as the first argument. */
@Injectable()
export class CategoryRepoService {
  constructor(private prisma: PrismaService) {}

  async getCategory(
    familyId: string,
    where: Prisma.CategoryWhereUniqueInput,
  ): Promise<CategoryDomain | null> {
    const raw = await this.prisma.category.findUnique({
      where: uniqueInScope(where, familyScope.category(familyId)),
    });

    return raw ? CategoryDomain.fromRaw(raw) : null;
  }

  async categories(
    familyId: string,
    params: {
      skip: number;
      take: number;
      where?: Prisma.CategoryWhereInput;
      orderBy?: Prisma.CategoryOrderByWithRelationInput;
    },
  ): Promise<PaginatedList<CategoryDomain>> {
    const { skip, take, orderBy } = params;
    const where = inScope(params.where, familyScope.category(familyId));
    const [count, raws] = await this.prisma.$transaction([
      this.prisma.category.count({ where }),
      this.prisma.category.findMany({ skip, take, where, orderBy }),
    ]);

    return {
      data: raws.map(CategoryDomain.fromRaw),
      total: count,
    };
  }

  async createCategory(
    familyId: string,
    data: Omit<Prisma.CategoryCreateInput, 'family'>,
  ): Promise<CategoryDomain> {
    const raw = await this.prisma.category.create({
      data: { ...data, family: { connect: { id: familyId } } },
    });

    return CategoryDomain.fromRaw(raw);
  }

  async updateCategory(
    familyId: string,
    params: {
      where: Prisma.CategoryWhereUniqueInput;
      data: Omit<Prisma.CategoryUpdateInput, 'family'>;
    },
  ): Promise<CategoryDomain> {
    const raw = await this.prisma.category.update({
      data: params.data,
      where: uniqueInScope(params.where, familyScope.category(familyId)),
    });
    return CategoryDomain.fromRaw(raw);
  }
}
