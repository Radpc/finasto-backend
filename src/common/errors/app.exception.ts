import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-code';

/** An HTTP error with a stable code, rendered as `{ statusCode, code, message, details? }`. */
export class AppException extends HttpException {
  constructor(
    readonly code: ErrorCode,
    status: HttpStatus,
    message: string,
    readonly details?: unknown,
  ) {
    super({ code, message, details }, status);
  }
}
