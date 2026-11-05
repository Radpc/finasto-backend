import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import { PrismaService } from 'src/database/prisma.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';
import { AppException } from '../errors/app.exception';
import { ErrorCode } from '../errors/error-code';

export const FAMILY_HEADER = 'x-family-id';

export type FamilyRequest = Request & { user: UserDTO; familyId: string };

const notMember = () =>
  new AppException(ErrorCode.NotFound, HttpStatus.NOT_FOUND, 'Not found');

/**
 * Resolves the family a request acts on and puts its id on `req.familyId`.
 *
 * The family comes from the `X-Family-Id` header. Until every client sends
 * it, a `familyId` in the body or query is read the same way, and someone
 * who belongs to a single family needs neither. A family the requester does
 * not belong to answers 404, like one that does not exist.
 *
 * Runs after the auth guard, which sets `req.user`.
 */
@Injectable()
export class FamilyContextGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FamilyRequest>();
    const requested = this.requestedFamilyId(req);

    if (requested) {
      if (!isUUID(requested)) throw notMember();
      const member = await this.prisma.family.count({
        where: { id: requested, users: { some: { id: req.user.id } } },
      });
      if (!member) throw notMember();
      req.familyId = requested;
      return true;
    }

    const families = await this.prisma.family.findMany({
      where: { users: { some: { id: req.user.id } } },
      select: { id: true },
      take: 2,
    });
    if (families.length !== 1) {
      throw new AppException(
        ErrorCode.FamilyRequired,
        HttpStatus.BAD_REQUEST,
        'Send the X-Family-Id header to choose a family',
      );
    }
    req.familyId = families[0].id;
    return true;
  }

  private requestedFamilyId(req: FamilyRequest): string | undefined {
    const candidates = [
      req.header(FAMILY_HEADER),
      (req.body as { familyId?: unknown } | undefined)?.familyId,
      req.query?.familyId,
    ].filter((value): value is string => typeof value === 'string' && !!value);

    if (new Set(candidates).size > 1) {
      throw new AppException(
        ErrorCode.FamilyMismatch,
        HttpStatus.BAD_REQUEST,
        'familyId does not match the X-Family-Id header',
      );
    }
    return candidates[0];
  }
}
