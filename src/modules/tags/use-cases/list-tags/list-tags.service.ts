import { Injectable } from '@nestjs/common';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';
import { TagDomain } from '../../domain/tag.domain';
import { ListTagsQuery } from './list-tags.dto';
import { PaginatedList } from 'src/types/utils';

type Input = {
  query: ListTagsQuery;
  requesterId: string;
};
type Output = PaginatedList<TagDomain>;

@Injectable()
export class ListTagsService {
  constructor(private readonly tagRepository: TagRepoService) {}

  async execute(input: Input): Promise<Output> {
    const take = input.query.pageSize;
    const skip = take * (input.query.page - 1);

    return this.tagRepository.getTags({
      take,
      skip,
      where: {
        family: { users: { some: { id: input.requesterId } } },
        label: input.query.searchBy
          ? { contains: input.query.searchBy }
          : undefined,
      },
    });
  }
}
