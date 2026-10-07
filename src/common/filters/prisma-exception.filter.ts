import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

/**
 * Maps Prisma "known request" errors to HTTP responses instead of 500s.
 * P2025 (record not found, e.g. a scoped connect/update that matched nothing)
 * becomes 404, so a resource from another family looks exactly like a
 * missing one.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    switch (exception.code) {
      case 'P2025':
      case 'P2018':
        return response
          .status(HttpStatus.NOT_FOUND)
          .json({ statusCode: HttpStatus.NOT_FOUND, message: 'Not Found' });
      case 'P2002':
        return response
          .status(HttpStatus.CONFLICT)
          .json({ statusCode: HttpStatus.CONFLICT, message: 'Conflict' });
      default:
        return super.catch(exception, host);
    }
  }
}
