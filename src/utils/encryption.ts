import * as crypto from 'crypto';
// import { appConfig } from 'src/config/configuration';

const apiKeySecret = '0123456789abcdef0123456789abcdef';
const algorithm = 'aes-256-ecb';

export function apiKeyEncrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, apiKeySecret, null);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function apiKeyDecrypt(encryptedText: string) {
  const decipher = crypto.createDecipheriv(algorithm, apiKeySecret, null);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
