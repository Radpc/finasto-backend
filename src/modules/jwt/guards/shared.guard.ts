import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ApiKeyAndJwtGuard extends AuthGuard(['jwt', 'x-api-key']) {}
