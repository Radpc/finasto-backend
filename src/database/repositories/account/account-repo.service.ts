import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { AccountDomain } from 'src/modules/account/domain/account.domain';
import { Prisma } from '@prisma/client';
import { PaginatedList } from 'src/types/utils';
import { familyScope, inScope, uniqueInScope } from '../../family-scope';

/** Every method works inside one family, given as the first argument. */
@Injectable()
export class AccountRepoService {
  constructor(private prisma: PrismaService) {}

  async getAccount(
    familyId: string,
    where: Prisma.AccountWhereUniqueInput,
  ): Promise<AccountDomain | null> {
    const raw = await this.prisma.account.findUnique({
      where: uniqueInScope(where, familyScope.account(familyId)),
    });

    return raw ? AccountDomain.fromRaw(raw) : null;
  }

  async getAccounts(
    familyId: string,
    params: {
      skip?: number;
      take?: number;
      where?: Prisma.AccountWhereInput;
      orderBy?: Prisma.AccountOrderByWithRelationInput;
    },
  ): Promise<PaginatedList<AccountDomain>> {
    const { skip, take, orderBy } = params;
    const where = inScope(params.where, familyScope.account(familyId));
    const [raws, count] = await this.prisma.$transaction([
      this.prisma.account.findMany({ skip, take, where, orderBy }),
      this.prisma.account.count({ where }),
    ]);

    return { data: raws.map(AccountDomain.fromRaw), total: count };
  }

  async createAccount(
    familyId: string,
    data: Omit<Prisma.AccountCreateInput, 'family'>,
  ): Promise<AccountDomain> {
    const raw = await this.prisma.account.create({
      data: { ...data, family: { connect: { id: familyId } } },
    });

    return AccountDomain.fromRaw(raw);
  }

  async updateAccount(
    familyId: string,
    params: {
      where: Prisma.AccountWhereUniqueInput;
      data: Omit<Prisma.AccountUpdateInput, 'family'>;
    },
  ): Promise<AccountDomain> {
    const raw = await this.prisma.account.update({
      data: params.data,
      where: uniqueInScope(params.where, familyScope.account(familyId)),
    });
    return AccountDomain.fromRaw(raw);
  }
}
