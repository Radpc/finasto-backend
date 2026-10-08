import { Injectable, NotFoundException } from '@nestjs/common';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';
import { TagDomain } from '../../domain/tag.domain';

type Input = {
  familyId: string;
  tagId: string;
};
type Output = TagDomain;

@Injectable()
export class GetTagByIdService {
  constructor(private readonly tagRepository: TagRepoService) {}

  async execute(input: Input): Promise<Output> {
    const newTag = await this.tagRepository.getTag(input.familyId, {
      id: input.tagId,
    });

    if (!newTag) throw new NotFoundException();

    return newTag;
  }
}
