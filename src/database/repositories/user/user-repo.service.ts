import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma } from '@prisma/client';
import { UserDomain } from 'src/modules/user/domain/user.domain';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PaginatedList } from 'src/types/utils';
import { familyScope, inScope, uniqueInScope } from '../../family-scope';

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

  /**
   * Attaches an Auth0 user id to the user with this email, unless that user
   * is already linked to an Auth0 identity. Returns whether a row changed.
   */
  async linkAuth0Sub(email: string, auth0Sub: string): Promise<boolean> {
    const { count } = await this.prisma.user.updateMany({
      where: { email, auth0Sub: null },
      data: { auth0Sub },
    });
    return count === 1;
  }

  /** Members of one family. */
  async getUsers(
    familyId: string,
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
      include?: Prisma.UserInclude<DefaultArgs>;
    },
  ): Promise<PaginatedList<UserDomain>> {
    const { skip, take, orderBy, include } = params;
    const where = inScope(params.where, familyScope.user(familyId));

    const [raws, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({ skip, take, where, orderBy, include }),
      this.prisma.user.count({ where }),
    ]);

    return { data: raws.map(UserDomain.fromRaw), total: count };
  }

  /** A member of one family. */
  async getFamilyMember(
    familyId: string,
    options: GetUniqueInput,
  ): Promise<UserDomain | null> {
    const raw = await this.prisma.user.findUnique({
      ...options,
      where: uniqueInScope(options.where, familyScope.user(familyId)),
    });

    return raw ? UserDomain.fromRaw(raw) : null;
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
