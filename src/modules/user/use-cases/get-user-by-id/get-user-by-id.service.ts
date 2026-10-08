import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { UserDomain } from '../../domain/user.domain';
import { UserDTO } from '../../dto/user.dto';

type Input = {
  userId: string;
  requester: UserDTO;
};
type Output = UserDomain;

@Injectable()
export class GetUserByIdService {
  constructor(private readonly userRepoService: UserRepoService) {}

  async execute(input: Input): Promise<Output> {
    const result = await this.userRepoService.getUser({
      where: {
        id: input.userId,
        families: { some: { users: { some: { id: input.requester.id } } } },
      },
    });

    if (!result) throw new NotFoundException();

    return result;
  }
}
