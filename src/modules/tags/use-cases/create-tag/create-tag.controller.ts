import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTagService } from './create-tag.service';
import { ControllerResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { CreateTagDTO } from '../../dto/create-tag.dto';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('tags')
@ApiTags('Tag')
export class CreateTagController {
  constructor(private readonly createTagService: CreateTagService) {}

  @Post()
  async handle(
    @FamilyId() familyId: string,
    @Body() createTagDTO: CreateTagDTO,
  ): ControllerResponse<TagDTO> {
    const result = await this.createTagService.execute({
      familyId,
      createTagDTO,
    });
    return result.toDTO();
  }
}
