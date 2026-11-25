import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

// Local demo data. Runs only when the demo user does not exist yet, so it is
// safe to run again. Never run against a real database.
const user = {
  email: 'admin@email.com',
  password: '12345',
};

const prisma = new PrismaClient();

/** A date in the current month, so the payments page shows data right away. */
const thisMonth = (day: number) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), day, 12);
};

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: user.email } });
  if (admin) return;

  const family = await prisma.family.create({ data: { name: 'Family' } });
  const mainAccount = await prisma.account.create({
    data: { name: 'Main account', familyId: family.id },
  });
  const card = await prisma.account.create({
    data: { name: 'Credit card', familyId: family.id },
  });

  const created = await prisma.user.create({
    data: {
      name: 'Admin',
      email: user.email,
      password: hashSync(user.password),
      role: 'familyHead',
      families: { connect: { id: family.id } },
    },
  });

  const category = async (label: string) =>
    prisma.category.create({ data: { label, familyId: family.id } });
  const salary = await category('Salário');
  const groceries = await category('Mercado');
  const home = await category('Casa');
  const leisure = await category('Lazer');

  const tag = async (label: string) =>
    prisma.tag.create({ data: { label, familyId: family.id } });
  const essential = await tag('Essencial');
  const optional = await tag('Supérfluo');

  const payments = [
    {
      description: 'Salário',
      value: 5000,
      status: 'Paid',
      paymentMethod: 'Pix',
      day: 5,
      accountId: mainAccount.id,
      categoryId: salary.id,
      tags: [],
    },
    {
      description: 'Aluguel',
      value: -1800,
      status: 'Paid',
      paymentMethod: 'Pix',
      day: 10,
      accountId: mainAccount.id,
      categoryId: home.id,
      tags: [essential.id],
    },
    {
      description: 'Compras do mês',
      value: -642.37,
      status: 'Paid',
      paymentMethod: 'Debit',
      day: 12,
      accountId: mainAccount.id,
      categoryId: groceries.id,
      tags: [essential.id],
    },
    {
      description: 'Cinema',
      value: -86,
      status: 'Paid',
      paymentMethod: 'Credit',
      day: 15,
      accountId: card.id,
      categoryId: leisure.id,
      tags: [optional.id],
    },
    {
      description: 'Conta de luz',
      value: -210.5,
      status: 'Pending',
      paymentMethod: 'Pix',
      day: 25,
      accountId: mainAccount.id,
      categoryId: home.id,
      tags: [essential.id],
    },
  ];

  for (const { day, tags, ...payment } of payments) {
    await prisma.payment.create({
      data: {
        ...payment,
        paymentDate: thisMonth(day),
        userId: created.id,
        tags: { connect: tags.map((id) => ({ id })) },
      },
    });
  }

  await prisma.recurringPayment.create({
    data: {
      description: 'Streaming',
      paymentMethod: 'Credit',
      automaticPayment: true,
      singlePaymentValue: -55.9,
      dayOfMonth: 20,
      accountId: card.id,
      categoryId: leisure.id,
      userId: created.id,
      tags: { connect: [{ id: optional.id }] },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
