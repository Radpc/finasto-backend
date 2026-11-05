import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

/** Every success is `{ data }` and every error is `{ statusCode, code, message, details? }`. */
describe('Response and error shape (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let familyId: string;
  let categoryId: string;
  let token: string;
  const run = randomUUID().slice(0, 8);
  const email = `shape-head-${run}@test.local`;
  const password = 'long-enough-password';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);

    const family = await prisma.family.create({
      data: { name: `shape-${run}` },
    });
    familyId = family.id;
    const user = await prisma.user.create({
      data: {
        name: 'Shape Head',
        email,
        password: await hash(password, 4),
        role: 'familyHead',
        families: { connect: { id: familyId } },
      },
    });
    for (const label of ['Food', 'Home']) {
      const category = await prisma.category.create({
        data: { label, familyId },
      });
      categoryId = category.id;
    }
    token = app
      .get(JwtService)
      .sign(
        { id: user.id, name: user.name, email, role: user.role },
        { secret: process.env.JWT_USER_SECRET, expiresIn: '5m' },
      );
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { endsWith: `-${run}@test.local` } },
    });
    await prisma.category.deleteMany({ where: { familyId } });
    await prisma.family.deleteMany({ where: { id: familyId } });
    await app.close();
  });

  const api = () => request(app.getHttpServer());
  const auth = () => ({ authorization: `Bearer ${token}` });
  const get = (path: string) => api().get(path).set(auth());

  it('returns a single resource as { data } and nothing else', async () => {
    const res = await get(`/categories/${categoryId}`).expect(200);
    expect(Object.keys(res.body)).toEqual(['data']);
    expect(res.body.data).toMatchObject({ id: categoryId, label: 'Home' });
  });

  it('returns a list as { data: { items, pagination } }', async () => {
    const res = await get('/categories?page=2&pageSize=1').expect(200);
    expect(Object.keys(res.body)).toEqual(['data']);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.pagination).toEqual({
      page: 2,
      pageSize: 1,
      total: 2,
    });
  });

  it('lists each invalid field', async () => {
    const res = await api()
      .post('/accounts')
      .set(auth())
      .send({ name: 42 })
      .expect(400);
    expect(res.body).toMatchObject({
      statusCode: 400,
      code: 'VALIDATION_FAILED',
      message: expect.any(String),
    });
    expect(res.body.details).toEqual([
      { field: 'name', constraints: { isString: expect.any(String) } },
    ]);
  });

  it('rejects a malformed JSON body with the same shape', async () => {
    const res = await api()
      .post('/categories')
      .set({ ...auth(), 'content-type': 'application/json' })
      .send('{"label":')
      .expect(400);
    expect(res.body).toMatchObject({ statusCode: 400, code: 'BAD_REQUEST' });
  });

  it('returns NOT_FOUND for a missing resource', async () => {
    const res = await get(`/categories/${randomUUID()}`).expect(404);
    expect(res.body).toEqual({
      statusCode: 404,
      code: 'NOT_FOUND',
      message: expect.any(String),
    });
  });

  it('returns UNAUTHORIZED without credentials', async () => {
    const res = await api().get('/categories').expect(401);
    expect(res.body).toMatchObject({ statusCode: 401, code: 'UNAUTHORIZED' });
  });

  it('returns INVALID_CREDENTIALS for a wrong password', async () => {
    const res = await api()
      .post('/login')
      .send({ email, password: 'wrong-password-here' })
      .expect(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns the token as { data: { jwt, user } } on sign-in', async () => {
    const res = await api()
      .post('/login')
      .send({ email, password })
      .expect(201);
    expect(Object.keys(res.body)).toEqual(['data']);
    expect(res.body.data).toMatchObject({
      jwt: expect.any(String),
      user: { email },
    });
  });

  it('returns EMAIL_IN_USE when adding a user with a taken email', async () => {
    const res = await api()
      .post('/users')
      .set(auth())
      .send({
        name: 'Copy',
        email,
        password,
        familyId,
        role: 'familyMember',
      })
      .expect(409);
    expect(res.body.code).toBe('EMAIL_IN_USE');
  });

  it('returns INVALID_TIMEZONE instead of a server error', async () => {
    const res = await get(
      '/payments/value-sum-by-period?periodType=daily' +
        '&since=2026-10-01T00:00:00%2B15:00&until=2026-10-31T00:00:00%2B15:00',
    ).expect(400);
    expect(res.body.code).toBe('INVALID_TIMEZONE');
  });
});
