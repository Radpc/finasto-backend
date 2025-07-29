import { Injectable } from '@nestjs/common';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';
import { TagDomain } from '../../domain/tag.domain';
import { ListTagsQuery } from './list-tags.dto';

type Input = {
  query: ListTagsQuery;
};
type Output = {
  data: TagDomain[];
  total: number;
  message: 'Success';
};

@Injectable()
export class ListTagsService {
  constructor(private readonly tagRepository: TagRepoService) {}

  async execute(input: Input): Promise<Output> {
    const take = input.query.pageSize;
    const skip = take * (input.query.page - 1);

    const { data, total } = await this.tagRepository.getTags({
      take,
      skip,
      where: {
        label: input.query.searchBy
          ? { contains: input.query.searchBy }
          : undefined,
      },
    });

    return { data, total, message: 'Success' };
  }
}
