import { HttpStatus, ValidationError } from '@nestjs/common';
import { AppException } from './app.exception';
import { ErrorCode } from './error-code';

export type FieldError = { field: string; constraints: Record<string, string> };

/** Flattens class-validator errors into `{ field: 'a.b', constraints }` entries. */
export function flattenValidationErrors(
  errors: ValidationError[],
  parent = '',
): FieldError[] {
  return errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const own = error.constraints
      ? [{ field, constraints: error.constraints }]
      : [];
    return [...own, ...flattenValidationErrors(error.children ?? [], field)];
  });
}

export const validationExceptionFactory = (errors: ValidationError[]) =>
  new AppException(
    ErrorCode.ValidationFailed,
    HttpStatus.BAD_REQUEST,
    'The request has invalid fields',
    flattenValidationErrors(errors),
  );
