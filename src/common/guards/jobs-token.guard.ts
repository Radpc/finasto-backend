import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';

/**
 * Jobs touch every family's data, so no user may trigger them. Manual job
 * endpoints require the `x-jobs-token` header to match JOBS_TOKEN, and are
 * disabled entirely when JOBS_TOKEN is not set.
 */
@Injectable()
export class JobsTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = this.config.get<string>('JOBS_TOKEN');
    const provided = context.switchToHttp().getRequest().headers[
      'x-jobs-token'
    ];

    if (!expected || typeof provided !== 'string') {
      throw new UnauthorizedException();
    }

    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
