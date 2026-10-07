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
});
