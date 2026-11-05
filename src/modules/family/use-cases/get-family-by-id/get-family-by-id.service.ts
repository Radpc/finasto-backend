import { Injectable, NotFoundException } from '@nestjs/common';
import { FamilyDomain } from '../../domain/family.domain';
import { FamilyRepoService } from 'src/database/repositories/family/family-repo.service';

type Input = {
  familyId: string;
  requesterId: string;
};

type Output = FamilyDomain;

@Injectable()
export class GetFamilyByIdService {
  constructor(private readonly familyRepoService: FamilyRepoService) {}

  async execute(input: Input): Promise<Output> {
    const result = await this.familyRepoService.getFamily({
      id: input.familyId,
      users: { some: { id: input.requesterId } },
    });

    if (!result) throw new NotFoundException();

    return result;
  }
}
