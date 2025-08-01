import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { FamilyDomain } from 'src/modules/family/domain/family.domain';
import { Prisma } from '@prisma/client';
import { PaginatedList } from 'src/types/utils';

@Injectable()
export class FamilyRepoService {
  constructor(private prisma: PrismaService) {}

  async getFamily(
    familyWhereUniqueInput: Prisma.FamilyWhereUniqueInput,
  ): Promise<FamilyDomain | null> {
    const raw = await this.prisma.family.findUnique({
      where: familyWhereUniqueInput,
    });

    return raw ? FamilyDomain.fromRaw(raw) : null;
  }

  async getFamilies(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.FamilyWhereUniqueInput;
    where?: Prisma.FamilyWhereInput;
    orderBy?: Prisma.FamilyOrderByWithRelationInput;
  }): Promise<PaginatedList<FamilyDomain>> {
    const { skip, take, cursor, where, orderBy } = params;

    const query = {
      skip,
      take,
      cursor,
      where,
      orderBy,
    } satisfies Prisma.FamilyFindManyArgs;

    const [raws, count] = await this.prisma.$transaction([
      this.prisma.family.findMany(query),
      this.prisma.family.count({ where: query.where }),
    ]);

    return { data: raws.map(FamilyDomain.fromRaw), total: count };
  }

  async createFamily(data: Prisma.FamilyCreateInput): Promise<FamilyDomain> {
    const raw = await this.prisma.family.create({
      data,
    });

    return FamilyDomain.fromRaw(raw);
  }

  async updateFamily(params: {
    where: Prisma.FamilyWhereUniqueInput;
    data: Prisma.FamilyUpdateInput;
  }): Promise<FamilyDomain> {
    const { where, data } = params;

    const raw = await this.prisma.family.update({
      data,
      where,
    });
    return FamilyDomain.fromRaw(raw);
  }

  async deleteFamily(
    where: Prisma.FamilyWhereUniqueInput,
  ): Promise<FamilyDomain> {
    const raw = await this.prisma.family.delete({
      where,
    });

    return FamilyDomain.fromRaw(raw);
  }
}
