import { Injectable } from '@nestjs/common';
import { UpdateTagDTO } from '../../dto/update-tag.dto';
import { TagDomain } from '../../domain/tag.domain';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';

type Input = { tagId: string; updateTagDTO: UpdateTagDTO; requesterId: string };
type Output = TagDomain;

@Injectable()
export class UpdateTagService {
  constructor(private readonly tagRepository: TagRepoService) {}

  async execute(input: Input): Promise<Output> {
    const result = await this.tagRepository.updateTag({
      where: {
        id: input.tagId,
        family: { users: { some: { id: input.requesterId } } },
      },
      data: { label: input.updateTagDTO.label },
    });

    return result;
  }
}
