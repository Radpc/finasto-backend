import { Injectable, NotFoundException } from '@nestjs/common';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';
import { TagDomain } from '../../domain/tag.domain';

type Input = {
  tagId: string;
  requesterId: string;
};
type Output = {
  data: TagDomain;
  message: 'Success';
};

@Injectable()
export class GetTagByIdService {
  constructor(private readonly tagRepository: TagRepoService) {}

  async execute(input: Input): Promise<Output> {
    const newTag = await this.tagRepository.getTag({
      id: input.tagId,
      family: { users: { some: { id: input.requesterId } } },
    });

    if (!newTag) throw new NotFoundException();

    return { data: newTag, message: 'Success' };
  }
}
