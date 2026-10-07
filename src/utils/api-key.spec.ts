import { generateApiKey, hashApiKey } from './api-key';

describe('api keys', () => {
  it('generates distinct prefixed keys', () => {
    const a = generateApiKey();
    const b = generateApiKey();
    expect(a).toMatch(/^fin_[A-Za-z0-9_-]{43}$/);
    expect(a).not.toEqual(b);
  });

  it('hashes deterministically without revealing the key', () => {
    const key = generateApiKey();
    expect(hashApiKey(key)).toEqual(hashApiKey(key));
    expect(hashApiKey(key)).toHaveLength(64);
    expect(hashApiKey(key)).not.toContain(key);
  });
});
