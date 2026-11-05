import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

/**
 * A user in two families, Home and Work, and a family they are not in.
 * Requests act on the family named by X-Family-Id.
 */
describe('Active family (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let home: string;
  let work: string;
  let other: string;
  let userId: string;
  const run = randomUUID().slice(0, 8);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);

    const family = async (name: string) => {
      const created = await prisma.family.create({
        data: {
          name: `${name}-${run}`,
          categories: { create: { label: `${name} category` } },
        },
      });
      return created.id;
    };
    home = await family('home');
    work = await family('work');
    other = await family('other');

    const user = await prisma.user.create({
      data: {
        name: 'Two Families',
        email: `two-${run}@test.local`,
        password: 'not-used',
        role: 'familyHead',
        families: { connect: [{ id: home }, { id: work }] },
      },
    });
    userId = user.id;
    token = app
      .get(JwtService)
      .sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        { secret: process.env.JWT_USER_SECRET, expiresIn: '5m' },
      );
  });

  afterAll(async () => {
    const families = [home, work, other].filter(Boolean);
    await prisma.payment.deleteMany({
      where: { account: { familyId: { in: families } } },
    });
    await prisma.account.deleteMany({ where: { familyId: { in: families } } });
    await prisma.user.deleteMany({
      where: { email: { endsWith: `-${run}@test.local` } },
    });
    await prisma.category.deleteMany({
      where: { familyId: { in: families } },
    });
    await prisma.family.deleteMany({ where: { id: { in: families } } });
    await app.close();
  });

  const api = () => request(app.getHttpServer());
  const auth = (familyId?: string) => ({
    authorization: `Bearer ${token}`,
    ...(familyId && { 'x-family-id': familyId }),
  });
  const labels = async (familyId: string) => {
    const res = await api()
      .get('/categories?page=1&pageSize=20')
      .set(auth(familyId))
      .expect(200);
    return res.body.data.items.map((c: { label: string }) => c.label);
  };

  it('lists only the family named in X-Family-Id', async () => {
    expect(await labels(home)).toEqual(['home category']);
    expect(await labels(work)).toEqual(['work category']);
  });

  it('asks for a family when the user has several and sends none', async () => {
    const res = await api()
      .get('/categories?page=1&pageSize=20')
      .set(auth())
      .expect(400);
    expect(res.body.code).toBe('FAMILY_REQUIRED');
  });

  it('answers 404 for a family the user is not in', async () => {
    for (const familyId of [other, randomUUID(), 'not-a-uuid']) {
      const res = await api()
        .get('/categories?page=1&pageSize=20')
        .set(auth(familyId))
        .expect(404);
      expect(res.body.code).toBe('NOT_FOUND');
    }
  });

  it('creates in the family named in X-Family-Id', async () => {
    const res = await api()
      .post('/categories')
      .set(auth(work))
      .send({ label: 'Created in work' })
      .expect(201);
    const stored = await prisma.category.findUniqueOrThrow({
      where: { id: res.body.data.id },
    });
    expect(stored.familyId).toBe(work);
  });

  it('still accepts familyId in the body from older clients', async () => {
    const res = await api()
      .post('/categories')
      .set(auth())
      .send({ label: 'Created in home', familyId: home })
      .expect(201);
    const stored = await prisma.category.findUniqueOrThrow({
      where: { id: res.body.data.id },
    });
    expect(stored.familyId).toBe(home);
  });

  it('refuses a body familyId that differs from the header', async () => {
    const res = await api()
      .post('/categories')
      .set(auth(home))
      .send({ label: 'Confused', familyId: work })
      .expect(400);
    expect(res.body.code).toBe('FAMILY_MISMATCH');
    expect(await prisma.category.count({ where: { label: 'Confused' } })).toBe(
      0,
    );
  });

  it("does not read another family's record through the active one", async () => {
    const workCategory = await prisma.category.findFirstOrThrow({
      where: { familyId: work },
    });
    await api()
      .get(`/categories/${workCategory.id}`)
      .set(auth(home))
      .expect(404);
    await api()
      .get(`/categories/${workCategory.id}`)
      .set(auth(work))
      .expect(200);
  });

  it('sums payments of the active family only', async () => {
    for (const [familyId, value] of [
      [home, -100],
      [work, -7],
    ] as const) {
      const category = await prisma.category.findFirstOrThrow({
        where: { familyId },
      });
      await prisma.account.create({
        data: {
          name: 'Main',
          familyId,
          payments: {
            create: {
              description: 'Groceries',
              value,
              status: 'Paid',
              paymentMethod: 'Cash',
              paymentDate: new Date('2026-10-05T12:00:00Z'),
              userId,
              categoryId: category.id,
            },
          },
        },
      });
    }
    const range = 'since=2026-10-01T00:00:00Z&until=2026-10-31T23:59:59Z';

    const sum = await api()
      .get(`/payments/value-sum?${range}`)
      .set(auth(home))
      .expect(200);
    expect(sum.body.data).toEqual({ gain: 0, loss: -100 });

    const byPeriod = await api()
      .get(`/payments/value-sum-by-period?periodType=monthly&${range}`)
      .set(auth(work))
      .expect(200);
    expect(byPeriod.body.data.map((p: { total: number }) => p.total)).toEqual([
      -7,
    ]);
  });
});
