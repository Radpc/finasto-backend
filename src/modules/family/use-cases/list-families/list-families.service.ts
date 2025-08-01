import { Injectable } from '@nestjs/common';
import { PaginatedList } from 'src/types/utils';
import { FamilyDomain } from '../../domain/family.domain';
import { FamilyRepoService } from 'src/database/repositories/family/family-repo.service';

type FindAllInput = {
  page: number;
  pageSize: number;
  name?: string;
};

type Input = {
  query: FindAllInput;
  requesterId: string;
};
type Output = {
  data: PaginatedList<FamilyDomain>;
  message: 'Success';
};

@Injectable()
export class ListFamiliesService {
  constructor(private familyRepository: FamilyRepoService) {}

  async execute({ query, requesterId }: Input): Promise<Output> {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const result = await this.familyRepository.getFamilies({
      where: {
        users: { some: { id: requesterId } },
        name: query.name ? { contains: query.name } : undefined,
      },
      skip,
      take,
    });

    return {
      data: result,
      message: 'Success',
    };
  }
}
