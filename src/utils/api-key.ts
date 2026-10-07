import { createHash, randomBytes } from 'crypto';

const API_KEY_PREFIX = 'fin_';

/** Generates a new API key. Show it to the user once; store only its hash. */
export function generateApiKey(): string {
  return API_KEY_PREFIX + randomBytes(32).toString('base64url');
}

/**
 * API keys are high-entropy random values, so a plain SHA-256 digest is
 * enough to store them safely and still look them up by equality.
 */
export function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey, 'utf8').digest('hex');
}
