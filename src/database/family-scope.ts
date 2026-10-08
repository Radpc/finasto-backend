import { Prisma } from '@prisma/client';

/**
 * The condition that keeps each model inside one family. Repositories add it
 * to every query that takes a family id, so a service cannot forget it.
 */
export const familyScope = {
  account: (familyId: string): Prisma.AccountWhereInput => ({ familyId }),
  category: (familyId: string): Prisma.CategoryWhereInput => ({ familyId }),
  tag: (familyId: string): Prisma.TagWhereInput => ({ familyId }),
  payment: (familyId: string): Prisma.PaymentWhereInput => ({
    account: { familyId },
  }),
  recurringPayment: (familyId: string): Prisma.RecurringPaymentWhereInput => ({
    account: { familyId },
  }),
  timeBudget: (familyId: string): Prisma.TimeBudgetWhereInput => ({
    category: { familyId },
  }),
  user: (familyId: string): Prisma.UserWhereInput => ({
    families: { some: { id: familyId } },
  }),
};

/** `where` narrowed to `scope`. */
export const inScope = <W>(where: W | undefined, scope: W): W =>
  ({ AND: [where ?? {}, scope] }) as W;

/** A unique `where` narrowed to `scope` (Prisma checks both). */
export const uniqueInScope = <U extends object, W>(where: U, scope: W): U =>
  ({ ...where, AND: [scope] }) as U;

/** Connect a family-owned record (account, category, tag) only if it is in `familyId`. */
export const connectInFamily = (familyId: string, id: string) => ({
  connect: { id, familyId },
});

/** The same for several records. */
export const connectManyInFamily = (familyId: string, ids: string[]) => ({
  connect: ids.map((id) => ({ id, familyId })),
});
