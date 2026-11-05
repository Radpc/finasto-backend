import {
  ArgumentsHost,
  ForbiddenException,
  HttpStatus,
  Logger,
  NotFoundException,
  ValidationError,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Prisma } from '@prisma/client';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppException } from './app.exception';
import { ErrorCode } from './error-code';
import { validationExceptionFactory } from './validation';

const render = (exception: unknown) => {
  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  const host = {
    switchToHttp: () => ({ getResponse: () => res }),
  } as unknown as ArgumentsHost;
  new AllExceptionsFilter().catch(exception, host);
  return {
    status: res.status.mock.calls[0][0],
    body: res.json.mock.calls[0][0],
  };
};

const fieldError = (error: Partial<ValidationError>) =>
  error as ValidationError;

const prismaError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError('raw prisma text', {
    code,
    clientVersion: 'test',
  });

describe('AllExceptionsFilter', () => {
  beforeAll(() => jest.spyOn(Logger.prototype, 'error').mockImplementation());
  afterAll(() => jest.restoreAllMocks());

  it('keeps the code and message of an AppException', () => {
    const { status, body } = render(
      new AppException(
        ErrorCode.EmailInUse,
        HttpStatus.CONFLICT,
        'Email already in use',
      ),
    );
    expect(status).toBe(409);
    expect(body).toEqual({
      statusCode: 409,
      code: 'EMAIL_IN_USE',
      message: 'Email already in use',
    });
  });

  it('derives the code from the status of a plain Nest exception', () => {
    expect(render(new NotFoundException()).body).toEqual({
      statusCode: 404,
      code: 'NOT_FOUND',
      message: 'Not Found',
    });
    expect(render(new ForbiddenException('No')).body.code).toBe('FORBIDDEN');
    expect(render(new ThrottlerException()).body.code).toBe('RATE_LIMITED');
  });

  it('lists every invalid field, including nested ones', () => {
    const child = fieldError({
      property: 'value',
      constraints: { isNumber: 'value must be a number' },
    });
    const errors = [
      fieldError({
        property: 'email',
        constraints: { isEmail: 'email must be an email' },
      }),
      fieldError({
        property: 'amount',
        children: [child],
      }),
    ];
    const { status, body } = render(validationExceptionFactory(errors));
    expect(status).toBe(400);
    expect(body).toEqual({
      statusCode: 400,
      code: 'VALIDATION_FAILED',
      message: 'The request has invalid fields',
      details: [
        { field: 'email', constraints: { isEmail: 'email must be an email' } },
        {
          field: 'amount.value',
          constraints: { isNumber: 'value must be a number' },
        },
      ],
    });
  });

  it('turns Prisma "record not found" into 404 without Prisma text', () => {
    for (const code of ['P2025', 'P2018']) {
      const { status, body } = render(prismaError(code));
      expect(status).toBe(404);
      expect(body).toEqual({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: 'Not found',
      });
    }
  });

  it('turns a unique constraint failure into 409', () => {
    const { status, body } = render(prismaError('P2002'));
    expect(status).toBe(409);
    expect(body.code).toBe('CONFLICT');
    expect(JSON.stringify(body)).not.toContain('raw prisma text');
  });

  it('hides the message of unexpected errors', () => {
    for (const exception of [
      new Error('connect ECONNREFUSED 10.0.0.5:3306'),
      prismaError('P1001'),
      'a thrown string',
    ]) {
      const { status, body } = render(exception);
      expect(status).toBe(500);
      expect(body).toEqual({
        statusCode: 500,
        code: 'INTERNAL',
        message: 'Internal server error',
      });
    }
  });
});
