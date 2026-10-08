import { Injectable, NotFoundException } from '@nestjs/common';
import { FamilyRepoService } from 'src/database/repositories/family/family-repo.service';
import { FamilyDomain } from '../domain/family.domain';

type Input = {
  familyId: string;
  userId: string;
};
type Output = FamilyDomain;

@Injectable()
export class CheckUserFamilyPermissionService {
  constructor(private readonly familyRepoService: FamilyRepoService) {}

  async execute(input: Input): Promise<Output> {
    const family = await this.familyRepoService.getFamily({
      id: input.familyId,
      users: { some: { id: input.userId } },
    });

    if (!family) throw new NotFoundException();

    return family;
  }
}
