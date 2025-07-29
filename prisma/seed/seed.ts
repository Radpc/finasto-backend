import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  hashSync;

  await prisma.user.upsert({
    where: { email: 'admin@email.com' },
    update: {
      name: 'Admin',
      email: 'admin@email.com',
      password: hashSync('12345'),
      role: 'admin',
    },
    create: {
      name: 'Admin',
      email: 'admin@email.com',
      password: hashSync('12345'),
      role: 'admin',
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
