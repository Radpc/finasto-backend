import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { codeForStatus, ErrorCode } from './error-code';

type ErrorBody = {
  statusCode: number;
  code: ErrorCode;
  message: string;
  details?: unknown;
};

/**
 * Renders every error as `{ statusCode, code, message, details? }`.
 *
 * Prisma "record not found" becomes 404, so a resource from another family
 * looks exactly like a missing one. Unexpected errors are logged and returned
 * as INTERNAL without their message, so internals never reach clients.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const body = this.toBody(exception);
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(body.statusCode)
      .json(body);
  }

  private toBody(exception: unknown): ErrorBody {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();
      const fields =
        typeof response === 'object' && response !== null
          ? (response as Record<string, unknown>)
          : {};
      const message =
        typeof fields.message === 'string'
          ? fields.message
          : typeof response === 'string'
            ? response
            : exception.message;

      if (statusCode >= 500) this.logger.error(exception.stack);

      return {
        statusCode,
        code: (fields.code as ErrorCode) ?? codeForStatus(statusCode),
        message,
        ...(fields.details !== undefined && { details: fields.details }),
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2025' || exception.code === 'P2018') {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          code: ErrorCode.NotFound,
          message: 'Not found',
        };
      }
      if (exception.code === 'P2002') {
        return {
          statusCode: HttpStatus.CONFLICT,
          code: ErrorCode.Conflict,
          message: 'Already exists',
        };
      }
    }

    this.logger.error(
      exception instanceof Error ? exception.stack : String(exception),
    );
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.Internal,
      message: 'Internal server error',
    };
  }
}
