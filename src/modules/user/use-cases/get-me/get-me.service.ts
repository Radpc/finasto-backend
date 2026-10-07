import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { UserDomain } from '../../domain/user.domain';

type Input = { requesterId: string };
type Output = { data: UserDomain; message: 'Success' };

@Injectable()
export class GetMeService {
  constructor(private readonly userRepoService: UserRepoService) {}

  async execute(input: Input): Promise<Output> {
    const result = await this.userRepoService.getUser({
      where: { id: input.requesterId },
      include: { families: true },
    });

    if (!result) throw new NotFoundException();

    return { data: result, message: 'Success' };
  }
}
