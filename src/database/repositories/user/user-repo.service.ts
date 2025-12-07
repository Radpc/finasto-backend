import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { UserDomain } from 'src/modules/user/domain/user.domain';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PaginatedList } from 'src/types/utils';

type GetUniqueInput = {
  select?: Prisma.UserSelect<DefaultArgs> | null | undefined;
  include?: Prisma.UserInclude<DefaultArgs> | null | undefined;
  where: Prisma.UserWhereUniqueInput;
};
@Injectable()
export class UserRepoService {
  constructor(private prisma: PrismaService) {}

  async getUser(options: GetUniqueInput): Promise<UserDomain | null> {
    const raw = await this.prisma.user.findUnique(options);
    return raw ? UserDomain.fromRaw(raw) : null;
  }

  async findByApiKeyHash(apiKeyHash: string): Promise<UserDomain | null> {
    const result = await this.prisma.user.findUnique({
      where: { apiKeyHash },
    });

    return result ? UserDomain.fromRaw(result) : null;
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude<DefaultArgs>;
  }): Promise<PaginatedList<UserDomain>> {
    const { skip, take, cursor, where, orderBy, include } = params;

    const query = {
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    } satisfies Prisma.UserFindManyArgs;

    const [raws, count] = await this.prisma.$transaction([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    return { data: raws.map(UserDomain.fromRaw), total: count };
  }

  async createUser(data: Prisma.UserCreateInput): Promise<UserDomain> {
    const raw = await this.prisma.user.create({
      data,
    });

    return UserDomain.fromRaw(raw);
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserDomain> {
    const { where, data } = params;
    const raw = await this.prisma.user.update({
      data,
      where,
    });

    return UserDomain.fromRaw(raw);
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<UserDomain> {
    const raw = await this.prisma.user.delete({
      where,
    });

    return UserDomain.fromRaw(raw);
  }
}
