import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AccountDomain } from 'src/modules/account/domain/account.domain';
import { Prisma } from '@prisma/client';
import { PaginatedList } from 'src/types/utils';

@Injectable()
export class AccountRepoService {
  constructor(private prisma: PrismaService) {}

  async getAccount(
    accountWhereUniqueInput: Prisma.AccountWhereUniqueInput,
  ): Promise<AccountDomain | null> {
    const raw = await this.prisma.account.findUnique({
      where: accountWhereUniqueInput,
    });

    return raw ? AccountDomain.fromRaw(raw) : null;
  }

  async getAccounts(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AccountWhereUniqueInput;
    where?: Prisma.AccountWhereInput;
    orderBy?: Prisma.AccountOrderByWithRelationInput;
  }): Promise<PaginatedList<AccountDomain>> {
    const { skip, take, cursor, where, orderBy } = params;

    const query = {
      skip,
      take,
      cursor,
      where,
      orderBy,
    } satisfies Prisma.AccountFindManyArgs;

    const [raws, count] = await this.prisma.$transaction([
      this.prisma.account.findMany(query),
      this.prisma.account.count({ where: query.where }),
    ]);

    return { data: raws.map(AccountDomain.fromRaw), total: count };
  }

  async createAccount(data: Prisma.AccountCreateInput): Promise<AccountDomain> {
    const raw = await this.prisma.account.create({
      data,
    });

    return AccountDomain.fromRaw(raw);
  }

  async updateAccount(params: {
    where: Prisma.AccountWhereUniqueInput;
    data: Prisma.AccountUpdateInput;
  }): Promise<AccountDomain> {
    const { where, data } = params;

    const raw = await this.prisma.account.update({
      data,
      where,
    });
    return AccountDomain.fromRaw(raw);
  }

  async deleteAccount(
    where: Prisma.AccountWhereUniqueInput,
  ): Promise<AccountDomain> {
    const raw = await this.prisma.account.delete({
      where,
    });

    return AccountDomain.fromRaw(raw);
  }
}
