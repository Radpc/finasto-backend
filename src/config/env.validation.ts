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

  if (config.PORT && Number.isNaN(Number(config.PORT))) {
    throw new Error('PORT must be a number');
  }

  return config;
}
