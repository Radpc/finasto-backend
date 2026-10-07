import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Accepts, in order: an Auth0 access token, a token from POST /login, or an
 * x-api-key header.
 */
@Injectable()
export class ApiKeyAndJwtGuard extends AuthGuard([
  'auth0',
  'jwt',
  'x-api-key',
]) {}
