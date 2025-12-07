import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { hashSync } from 'bcryptjs';
import { UserDomain } from '../../domain/user.domain';
import { UserDTO } from '../../dto/user.dto';

type Input = {
  payload: CreateUserDTO;
  requester: UserDTO;
};
type Output = {
  data: UserDomain;
  message: 'Success';
};

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepoService: UserRepoService) {}

  async execute(input: Input): Promise<Output> {
    const payload = input.payload;

    const userWithEmail = await this.userRepoService.getUser({
      where: { email: payload.email },
    });

    if (userWithEmail) throw new BadRequestException('Email already in use');

    const result = await this.userRepoService.createUser({
      name: payload.name,
      email: payload.email,
      password: hashSync(payload.password),
      role: payload.role,
      families: {
        connect: {
          id: payload.familyId,
          users: { some: { id: input.requester.id } },
        },
      },
    });

    return {
      data: result,
      message: 'Success',
    };
  }
}
