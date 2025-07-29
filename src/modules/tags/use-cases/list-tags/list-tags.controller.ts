import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { ListTagsService } from './list-tags.service';
import { ListTagsQuery } from './list-tags.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('tags')
@ApiTags('Tag')
export class ListTagsController {
  constructor(private readonly listTagsService: ListTagsService) {}

  @Get()
  async handle(
    @Query() query: ListTagsQuery,
  ): ControllerResponse<PaginatedResponse<TagDTO>> {
    const result = await this.listTagsService.execute({ query: query });
    return {
      message: 'Success',
      data: {
        items: result.data.map((d) => d.toDTO()),
        pagination: { page: query.page, total: result.total },
      },
    };
  }
}
