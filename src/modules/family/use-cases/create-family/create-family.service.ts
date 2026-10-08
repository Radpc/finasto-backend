import { Injectable } from '@nestjs/common';
import { FamilyDomain } from '../../domain/family.domain';
import { CreateFamilyDTO } from '../../dto/create-family.dto';
import { FamilyRepoService } from 'src/database/repositories/family/family-repo.service';

type Input = {
  payload: CreateFamilyDTO;
  requesterId: string;
};

type Output = FamilyDomain;

@Injectable()
export class CreateFamilyService {
  constructor(private readonly familyRepoService: FamilyRepoService) {}

  async execute(input: Input): Promise<Output> {
    const result = await this.familyRepoService.createFamily({
      name: input.payload.name,
      users: { connect: { id: input.requesterId } },
    });

    return result;
  }
}
