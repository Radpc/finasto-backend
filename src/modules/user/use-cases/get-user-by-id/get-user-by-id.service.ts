import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepoService } from 'src/database/repositories/user/user-repo.service';
import { UserDomain } from '../../domain/user.domain';

type Input = {
  familyId: string;
  userId: string;
};
type Output = UserDomain;

@Injectable()
export class GetUserByIdService {
  constructor(private readonly userRepoService: UserRepoService) {}

  async execute(input: Input): Promise<Output> {
    const result = await this.userRepoService.getFamilyMember(input.familyId, {
      where: { id: input.userId },
    });

    if (!result) throw new NotFoundException();

    return result;
  }
}
