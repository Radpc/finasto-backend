import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { FamilyContextGuard, FamilyRequest } from './family-context.guard';

/**
 * Signs the requester in and resolves the family the request acts on.
 * Read the family with `@FamilyId()`.
 */
export const FamilyScoped = () =>
  applyDecorators(
    UseGuards(ApiKeyAndJwtGuard, FamilyContextGuard),
    ApiBearerAuth(),
    ApiSecurity('x-api-key'),
    ApiHeader({
      name: 'X-Family-Id',
      required: false,
      description:
        'The family to act on. Optional when you belong to a single family.',
    }),
  );

/** The id of the family resolved by `@FamilyScoped()`. */
export const FamilyId = createParamDecorator(
  (_: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<FamilyRequest>().familyId,
);
