import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  const base = {
    DATABASE_URL: 'mysql://user:pass@localhost:3306/finasto',
    JWT_USER_SECRET: 'dev-secret',
  };

  it('accepts a minimal development config', () => {
    expect(validateEnv(base)).toEqual(base);
  });

  it('rejects a config without required variables', () => {
    expect(() => validateEnv({ JWT_USER_SECRET: 'x' })).toThrow('DATABASE_URL');
  });

  it('rejects a short JWT secret in production', () => {
    expect(() => validateEnv({ ...base, NODE_ENV: 'production' })).toThrow(
      'JWT_USER_SECRET',
    );
  });

  it('rejects a non-numeric port', () => {
    expect(() => validateEnv({ ...base, PORT: 'abc' })).toThrow('PORT');
  });

  it('requires the Auth0 issuer and audience together', () => {
    expect(() =>
      validateEnv({ ...base, AUTH0_ISSUER_URL: 'https://x.auth0.com/' }),
    ).toThrow('AUTH0_AUDIENCE');
  });

  it('rejects a plain-http Auth0 issuer in production', () => {
    expect(() =>
      validateEnv({
        ...base,
        NODE_ENV: 'production',
        JWT_USER_SECRET: 'x'.repeat(32),
        AUTH0_ISSUER_URL: 'http://x.auth0.com/',
        AUTH0_AUDIENCE: 'https://api.finasto.app',
      }),
    ).toThrow('https');
  });
});
