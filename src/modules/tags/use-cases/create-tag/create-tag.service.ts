import { Injectable } from '@nestjs/common';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';
import { CreateTagDTO } from '../../dto/create-tag.dto';
import { TagDomain } from '../../domain/tag.domain';

type Input = {
  createTagDTO: CreateTagDTO;
  requesterId: string;
};
type Output = {
  data: TagDomain;
  message: 'Success';
};

@Injectable()
export class CreateTagService {
  constructor(private readonly tagRepository: TagRepoService) {}

  async execute(input: Input): Promise<Output> {
    const newTag = await this.tagRepository.createTag({
      label: input.createTagDTO.label,
      family: {
        connect: {
          id: input.createTagDTO.familyId,
          users: { some: { id: input.requesterId } },
        },
      },
    });

    return { data: newTag, message: 'Success' };
  }
}
