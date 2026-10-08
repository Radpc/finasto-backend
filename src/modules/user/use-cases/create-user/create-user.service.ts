import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException } from 'src/common/errors/app.exception';
import { ErrorCode } from 'src/common/errors/error-code';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { hash } from 'bcryptjs';
import { UserDomain, UserRole } from '../../domain/user.domain';
import { UserDTO } from '../../dto/user.dto';

type Input = {
  familyId: string;
  payload: CreateUserDTO;
  requester: UserDTO;
};
type Output = UserDomain;

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepoService: UserRepoService) {}

  async execute(input: Input): Promise<Output> {
    const payload = input.payload;

    // Only family heads may add people. Per-family roles come with the
    // membership table in a later phase.
    if (input.requester.role !== UserRole.FamilyHead) {
      throw new AppException(
        ErrorCode.FamilyHeadOnly,
        HttpStatus.FORBIDDEN,
        'Only a family head can add users',
      );
    }

    const userWithEmail = await this.userRepoService.getUser({
      where: { email: payload.email },
    });

    if (userWithEmail) {
      throw new AppException(
        ErrorCode.EmailInUse,
        HttpStatus.CONFLICT,
        'Email already in use',
      );
    }

    const result = await this.userRepoService.createUser({
      name: payload.name,
      email: payload.email,
      password: await hash(payload.password, 12),
      role: payload.role,
      families: { connect: { id: input.familyId } },
    });

    return result;
  }
}
