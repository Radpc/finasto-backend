import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { TagDomain } from 'src/modules/tags/domain/tag.domain';
import { PaginatedList } from 'src/types/utils';
import { familyScope, inScope, uniqueInScope } from '../../family-scope';

/** Every method works inside one family, given as the first argument. */
@Injectable()
export class TagRepoService {
  constructor(private prisma: PrismaService) {}

  async getTag(
    familyId: string,
    where: Prisma.TagWhereUniqueInput,
  ): Promise<TagDomain | null> {
    const raw = await this.prisma.tag.findUnique({
      where: uniqueInScope(where, familyScope.tag(familyId)),
    });

    return raw ? TagDomain.fromRaw(raw) : null;
  }

  async getTags(
    familyId: string,
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.TagWhereInput;
      orderBy?: Prisma.TagOrderByWithRelationInput;
    },
  ): Promise<PaginatedList<TagDomain>> {
    const { skip, take, orderBy } = params;
    const where = inScope(params.where, familyScope.tag(familyId));
    const [count, raws] = await this.prisma.$transaction([
      this.prisma.tag.count({ where }),
      this.prisma.tag.findMany({ skip, take, where, orderBy }),
    ]);

    return {
      data: raws.map(TagDomain.fromRaw),
      total: count,
    };
  }

  async createTag(
    familyId: string,
    data: Omit<Prisma.TagCreateInput, 'family'>,
  ): Promise<TagDomain> {
    const raw = await this.prisma.tag.create({
      data: { ...data, family: { connect: { id: familyId } } },
    });

    return TagDomain.fromRaw(raw);
  }

  async updateTag(
    familyId: string,
    params: {
      where: Prisma.TagWhereUniqueInput;
      data: Omit<Prisma.TagUpdateInput, 'family'>;
    },
  ): Promise<TagDomain> {
    const raw = await this.prisma.tag.update({
      data: params.data,
      where: uniqueInScope(params.where, familyScope.tag(familyId)),
    });
    return TagDomain.fromRaw(raw);
  }
}
