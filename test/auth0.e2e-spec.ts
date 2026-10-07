import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateKeyPairSync, randomUUID } from 'crypto';
import { createServer, Server } from 'http';
import { AddressInfo } from 'net';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

/**
 * Runs the API against a fake Auth0 tenant: a local server that publishes a
 * JWKS and answers /userinfo, plus RSA keys to sign access tokens with.
 */
describe('Auth0 sign-in (e2e)', () => {
  const run = randomUUID().slice(0, 8);
  const audience = 'https://api.finasto.test';
  const kid = 'test-key';
  const tenantKey = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const strangerKey = generateKeyPairSync('rsa', { modulusLength: 2048 });

  let tenant: Server;
  let issuer: string;
  let userInfo: Record<string, unknown> = {};
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let familyId: string;
  const savedEnv = { ...process.env };

  const sign = (
    claims: Record<string, unknown>,
    opts: {
      key?: typeof tenantKey;
      iss?: string;
      aud?: string;
      expiresIn?: number;
    } = {},
  ) =>
    jwt.sign(claims, {
      algorithm: 'RS256',
      keyid: kid,
      privateKey: (opts.key ?? tenantKey).privateKey.export({
        type: 'pkcs8',
        format: 'pem',
      }),
      issuer: opts.iss ?? issuer,
      audience: opts.aud ?? audience,
      expiresIn: opts.expiresIn ?? 300,
    });

  const createUser = (label: string, auth0Sub?: string) =>
    prisma.user.create({
      data: {
        name: label,
        email: `${label}-${run}@test.local`,
        password: 'not-used',
        role: 'familyHead',
        auth0Sub,
        families: { connect: { id: familyId } },
      },
    });

  const me = (token: string) =>
    request(app.getHttpServer())
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

  beforeAll(async () => {
    const jwk = {
      ...tenantKey.publicKey.export({ format: 'jwk' }),
      kid,
      use: 'sig',
      alg: 'RS256',
    };
    tenant = createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      if (req.url === '/.well-known/jwks.json') {
        res.end(JSON.stringify({ keys: [jwk] }));
      } else if (req.url === '/userinfo') {
        res.end(JSON.stringify(userInfo));
      } else {
        res.statusCode = 404;
        res.end('{}');
      }
    });
    await new Promise<void>((resolve) => tenant.listen(0, resolve));
    issuer = `http://127.0.0.1:${(tenant.address() as AddressInfo).port}/`;

    process.env.AUTH0_ISSUER_URL = issuer;
    process.env.AUTH0_AUDIENCE = audience;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    jwt = app.get(JwtService);

    familyId = (await prisma.family.create({ data: { name: `auth0-${run}` } }))
      .id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { families: { some: { id: familyId } } },
    });
    await prisma.family.delete({ where: { id: familyId } });
    await app.close();
    await new Promise((resolve) => tenant.close(resolve));
    process.env = savedEnv;
  });

  it('signs in a user already linked to the Auth0 identity', async () => {
    const user = await createUser('linked', `auth0|linked-${run}`);
    const res = await me(sign({ sub: `auth0|linked-${run}` })).expect(200);
    expect(res.body.data.id).toBe(user.id);
    expect(res.body.data.families).toHaveLength(1);
  });

  it('links a first-time Auth0 sign-in to the user with that verified email', async () => {
    const user = await createUser('first');
    userInfo = { email: user.email, email_verified: true };

    const res = await me(sign({ sub: `google-oauth2|first-${run}` })).expect(
      200,
    );
    expect(res.body.data.id).toBe(user.id);

    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    expect(stored?.auth0Sub).toBe(`google-oauth2|first-${run}`);
  });

  it('refuses an unverified email', async () => {
    const user = await createUser('unverified');
    userInfo = { email: user.email, email_verified: false };
    await me(sign({ sub: `auth0|unverified-${run}` })).expect(403);

    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    expect(stored?.auth0Sub).toBeNull();
  });

  it('does not move an account to a second Auth0 identity', async () => {
    const user = await createUser('taken', `auth0|taken-${run}`);
    userInfo = { email: user.email, email_verified: true };
    await me(sign({ sub: `auth0|intruder-${run}` })).expect(403);

    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    expect(stored?.auth0Sub).toBe(`auth0|taken-${run}`);
  });

  it('refuses an email with no Finasto account', async () => {
    userInfo = { email: `nobody-${run}@test.local`, email_verified: true };
    await me(sign({ sub: `auth0|nobody-${run}` })).expect(403);
  });

  it.each([
    ['another audience', { aud: 'https://someone-else.test' }],
    ['another issuer', { iss: 'https://evil.auth0.com/' }],
    ['a key the tenant does not publish', { key: strangerKey }],
  ])('rejects a token for %s', async (_label, opts) => {
    await createUser(
      `reject-${_label.length}`,
      `auth0|reject-${_label.length}-${run}`,
    );
    await me(
      sign({ sub: `auth0|reject-${_label.length}-${run}` }, opts),
    ).expect(401);
  });

  it('rejects an expired token', async () => {
    await createUser('expired', `auth0|expired-${run}`);
    await me(sign({ sub: `auth0|expired-${run}` }, { expiresIn: -60 })).expect(
      401,
    );
  });

  it('still accepts tokens from POST /login', async () => {
    const user = await createUser('local');
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      { secret: process.env.JWT_USER_SECRET, expiresIn: '5m' },
    );
    const res = await me(token).expect(200);
    expect(res.body.data.id).toBe(user.id);
  });
});
