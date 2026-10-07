import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

type Tenant = {
  familyId: string;
  accountId: string;
  categoryId: string;
  headId: string;
  memberId: string;
  headToken: string;
  memberToken: string;
};

/**
 * Two families, A and B. Every test acts as B against A's ids and expects
 * the same answer as for an id that does not exist.
 */
describe('Tenant isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let a: Tenant;
  let b: Tenant;
  const run = randomUUID().slice(0, 8);

  const sign = (user: { id: string; email: string; role: string }) =>
    jwt.sign(
      { id: user.id, name: 'Test', email: user.email, role: user.role },
      { secret: process.env.JWT_USER_SECRET, expiresIn: '5m' },
    );

  const createTenant = async (name: string): Promise<Tenant> => {
    const family = await prisma.family.create({
      data: { name: `${name}-${run}` },
    });
    const account = await prisma.account.create({
      data: { name: 'Main', familyId: family.id },
    });
    const category = await prisma.category.create({
      data: { label: 'Food', familyId: family.id },
    });
    const mkUser = (role: string) =>
      prisma.user.create({
        data: {
          name: `${name} ${role}`,
          email: `${name}-${role}-${run}@test.local`,
          password: 'not-used',
          role,
          families: { connect: { id: family.id } },
        },
      });
    const head = await mkUser('familyHead');
    const member = await mkUser('familyMember');
    return {
      familyId: family.id,
      accountId: account.id,
      categoryId: category.id,
      headId: head.id,
      memberId: member.id,
      headToken: sign(head),
      memberToken: sign(member),
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);

    a = await createTenant('a');
    b = await createTenant('b');
  });

  afterAll(async () => {
    const families = [a?.familyId, b?.familyId].filter(Boolean);
    await prisma.timeBudget.deleteMany({
      where: { category: { familyId: { in: families } } },
    });
    await prisma.payment.deleteMany({
      where: { account: { familyId: { in: families } } },
    });
    await prisma.user.deleteMany({
      where: { email: { endsWith: `-${run}@test.local` } },
    });
    await prisma.category.deleteMany({ where: { familyId: { in: families } } });
    await prisma.account.deleteMany({ where: { familyId: { in: families } } });
    await prisma.family.deleteMany({ where: { id: { in: families } } });
    await app.close();
  });

  const auth = (token: string) => ({ authorization: `Bearer ${token}` });

  it("cannot create a payment in another family's account", async () => {
    await request(app.getHttpServer())
      .post('/payments')
      .set(auth(b.headToken))
      .send({
        accountId: a.accountId,
        categoryId: b.categoryId,
        description: 'intruder',
        value: -10,
        status: 'Paid',
        paymentMethod: 'Cash',
      })
      .expect(404);

    const count = await prisma.payment.count({
      where: { accountId: a.accountId },
    });
    expect(count).toBe(0);
  });

  it('can still create a payment in its own account', async () => {
    await request(app.getHttpServer())
      .post('/payments')
      .set(auth(b.headToken))
      .send({
        accountId: b.accountId,
        categoryId: b.categoryId,
        description: 'groceries',
        value: -10,
        status: 'Paid',
        paymentMethod: 'Cash',
      })
      .expect(201);
  });

  it("cannot create a time budget on another family's category", async () => {
    await request(app.getHttpServer())
      .post('/time-budgets')
      .set(auth(b.headToken))
      .send({
        categoryId: a.categoryId,
        budgetValue: 100,
        startDate: '2026-10-01T00:00:00.000Z',
        endDate: '2026-10-31T23:59:59.000Z',
      })
      .expect(404);
  });

  it('cannot move a category into another family', async () => {
    await request(app.getHttpServer())
      .patch(`/categories/${b.categoryId}`)
      .set(auth(b.headToken))
      .send({ label: 'Renamed', familyId: a.familyId })
      .expect(200);

    const category = await prisma.category.findUniqueOrThrow({
      where: { id: b.categoryId },
    });
    expect(category.familyId).toBe(b.familyId);
    expect(category.label).toBe('Renamed');
  });

  it("cannot update another family's category", async () => {
    await request(app.getHttpServer())
      .patch(`/categories/${a.categoryId}`)
      .set(auth(b.headToken))
      .send({ label: 'Hijacked' })
      .expect(404);
  });

  it("cannot read another family's account", async () => {
    await request(app.getHttpServer())
      .get(`/accounts/${a.accountId}`)
      .set(auth(b.headToken))
      .expect(404);
  });

  it('a family member cannot add users', async () => {
    await request(app.getHttpServer())
      .post('/users')
      .set(auth(b.memberToken))
      .send({
        name: 'New',
        email: `new-${run}@test.local`,
        password: 'long-enough-password',
        familyId: b.familyId,
        role: 'familyHead',
      })
      .expect(403);
  });

  it('job endpoints reject user tokens', async () => {
    await request(app.getHttpServer())
      .post('/jobs/update-predicted-payments')
      .set(auth(b.headToken))
      .expect(401);
  });

  it('rejects oversized pages', async () => {
    await request(app.getHttpServer())
      .get('/payments?page=1&pageSize=100000')
      .set(auth(b.headToken))
      .expect(400);
  });
});
