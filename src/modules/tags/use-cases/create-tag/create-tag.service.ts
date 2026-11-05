import { Injectable } from '@nestjs/common';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';
import { CreateTagDTO } from '../../dto/create-tag.dto';
import { TagDomain } from '../../domain/tag.domain';

type Input = {
  familyId: string;
  createTagDTO: CreateTagDTO;
};
type Output = TagDomain;

@Injectable()
export class CreateTagService {
  constructor(private readonly tagRepository: TagRepoService) {}

  async execute(input: Input): Promise<Output> {
    return this.tagRepository.createTag(input.familyId, {
      label: input.createTagDTO.label,
    });
  }
}
