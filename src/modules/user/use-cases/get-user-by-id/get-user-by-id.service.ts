import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { UserDomain } from '../../domain/user.domain';

type Input = {
  userId: string;
  requester: Requester;
};
type Output = {
  data: UserDomain;
  message: 'Success';
};

@Injectable()
export class GetUserByIdService {
  constructor(private readonly userRepoService: UserRepoService) {}

  async execute(input: Input): Promise<Output> {
    const result = await this.userRepoService.getUser({
      where: {
        id: input.userId,
        families: { some: { users: { some: { id: input.requester.userId } } } },
      },
    });

    if (!result) throw new NotFoundException();

    return {
      data: result,
      message: 'Success',
    };
  }
}
