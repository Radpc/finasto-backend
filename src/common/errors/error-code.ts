/**
 * Stable error codes returned in every error body. Clients translate these;
 * the `message` next to them is English text for developers and logs.
 * Add codes, never rename or reuse them.
 */
export enum ErrorCode {
  BadRequest = 'BAD_REQUEST',
  ValidationFailed = 'VALIDATION_FAILED',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  NotFound = 'NOT_FOUND',
  Conflict = 'CONFLICT',
  RateLimited = 'RATE_LIMITED',
  Internal = 'INTERNAL',

  InvalidCredentials = 'INVALID_CREDENTIALS',
  EmailNotVerified = 'EMAIL_NOT_VERIFIED',
  NoAccountForEmail = 'NO_ACCOUNT_FOR_EMAIL',
  EmailInUse = 'EMAIL_IN_USE',
  FamilyHeadOnly = 'FAMILY_HEAD_ONLY',
  InvalidDate = 'INVALID_DATE',
  InvalidTimezone = 'INVALID_TIMEZONE',
}

/** Code used when an exception carries only an HTTP status. */
export const codeForStatus = (status: number): ErrorCode => {
  switch (status) {
    case 400:
      return ErrorCode.BadRequest;
    case 401:
      return ErrorCode.Unauthorized;
    case 403:
      return ErrorCode.Forbidden;
    case 404:
      return ErrorCode.NotFound;
    case 409:
      return ErrorCode.Conflict;
    case 429:
      return ErrorCode.RateLimited;
    default:
      return status >= 500 ? ErrorCode.Internal : ErrorCode.BadRequest;
  }
};
