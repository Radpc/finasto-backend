import { Injectable } from '@nestjs/common';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';
import { TagDomain } from '../../domain/tag.domain';
import { ListTagsQuery } from './list-tags.dto';
import { PaginatedList } from 'src/types/utils';

type Input = {
  familyId: string;
  query: ListTagsQuery;
};
type Output = PaginatedList<TagDomain>;

@Injectable()
export class ListTagsService {
  constructor(private readonly tagRepository: TagRepoService) {}

  async execute(input: Input): Promise<Output> {
    const take = input.query.pageSize;
    const skip = take * (input.query.page - 1);

    return this.tagRepository.getTags(input.familyId, {
      take,
      skip,
      where: {
        label: input.query.searchBy
          ? { contains: input.query.searchBy }
          : undefined,
      },
    });
  }
}
