import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { GetTagByIdService } from './get-tag-by-id.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('tags')
@ApiTags('Tag')
export class GetTagByIdController {
  constructor(private readonly getTagByIdService: GetTagByIdService) {}

  @Get(':tagId')
  async handle(
    @FamilyId() familyId: string,
    @Param('tagId') tagId: string,
  ): ControllerResponse<TagDTO> {
    const result = await this.getTagByIdService.execute({
      familyId,
      tagId,
    });
    return result.toDTO();
  }
}
