type Env = Record<string, string | undefined>;

const REQUIRED = ['DATABASE_URL', 'JWT_USER_SECRET'] as const;

/**
 * Validates environment variables at boot so a misconfigured deploy fails
 * immediately instead of on the first request that needs a missing value.
 */
export function validateEnv(config: Env): Env {
  const missing = REQUIRED.filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }

  if (
    config.NODE_ENV === 'production' &&
    (config.JWT_USER_SECRET?.length ?? 0) < 32
  ) {
    throw new Error(
      'JWT_USER_SECRET must be at least 32 characters in production',
    );
  }

  if (
    config.NODE_ENV === 'production' &&
    config.JOBS_TOKEN &&
    config.JOBS_TOKEN.length < 32
  ) {
    throw new Error('JOBS_TOKEN must be at least 32 characters in production');
  }

  if (Boolean(config.AUTH0_ISSUER_URL) !== Boolean(config.AUTH0_AUDIENCE)) {
    throw new Error('AUTH0_ISSUER_URL and AUTH0_AUDIENCE must be set together');
  }

  if (config.AUTH0_ISSUER_URL) {
    let url: URL;
    try {
      url = new URL(config.AUTH0_ISSUER_URL);
    } catch {
      throw new Error('AUTH0_ISSUER_URL must be a URL');
    }
    if (config.NODE_ENV === 'production' && url.protocol !== 'https:') {
      throw new Error('AUTH0_ISSUER_URL must use https in production');
    }
  }

  if (config.PORT && Number.isNaN(Number(config.PORT))) {
    throw new Error('PORT must be a number');
  }

  return config;
}
