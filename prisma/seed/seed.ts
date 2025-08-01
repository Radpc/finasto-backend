import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const user = {
  email: 'admin@email.com',
  password: '12345',
};

const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.findUnique({ where: { email: user.email } });

  if (!admin) {
    const family = await prisma.family.create({ data: { name: 'Family' } });
    await prisma.account.create({
      data: { name: 'Main account', familyId: family.id },
    });

    await prisma.user.create({
      data: {
        name: 'Admin',
        email: user.email,
        password: hashSync(user.password),
        role: 'familyHead',
        families: { connect: { id: family.id } },
      },
    });
  }
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
