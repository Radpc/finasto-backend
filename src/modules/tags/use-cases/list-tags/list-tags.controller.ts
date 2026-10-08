import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { toPage } from 'src/common/pagination';
import { TagDTO } from '../../dto/tag.dto';
import { ListTagsService } from './list-tags.service';
import { ListTagsQuery } from './list-tags.dto';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('tags')
@ApiTags('Tag')
export class ListTagsController {
  constructor(private readonly listTagsService: ListTagsService) {}

  @Get()
  async handle(
    @FamilyId() familyId: string,
    @Query() query: ListTagsQuery,
  ): ControllerResponse<PaginatedResponse<TagDTO>> {
    const result = await this.listTagsService.execute({
      familyId,
      query,
    });
    return toPage(
      result.data.map((d) => d.toDTO()),
      result.total,
      query,
    );
  }
}
