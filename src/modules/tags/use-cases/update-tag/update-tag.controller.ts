import { Body, Controller, Param, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { UpdateTagService } from './update-tag.service';
import { UpdateTagDTO } from '../../dto/update-tag.dto';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('tags')
@ApiTags('Tag')
export class UpdateTagController {
  constructor(private readonly updateTagService: UpdateTagService) {}

  @Put(':tagId')
  async handle(
    @FamilyId() familyId: string,
    @Body() updateTagDTO: UpdateTagDTO,
    @Param('tagId') tagId: string,
  ): ControllerResponse<TagDTO> {
    const result = await this.updateTagService.execute({
      familyId,
      tagId,
      updateTagDTO,
    });
    return result.toDTO();
  }
}
