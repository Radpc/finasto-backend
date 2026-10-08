import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { toPage } from 'src/common/pagination';
import { TagDTO } from '../../dto/tag.dto';
import { ListTagsService } from './list-tags.service';
import { ListTagsQuery } from './list-tags.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('tags')
@ApiTags('Tag')
export class ListTagsController {
  constructor(private readonly listTagsService: ListTagsService) {}

  @Get()
  async handle(
    @Query() query: ListTagsQuery,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<PaginatedResponse<TagDTO>> {
    const result = await this.listTagsService.execute({
      query,
      requesterId: req.user.id,
    });
    return toPage(
      result.data.map((d) => d.toDTO()),
      result.total,
      query,
    );
  }
}
