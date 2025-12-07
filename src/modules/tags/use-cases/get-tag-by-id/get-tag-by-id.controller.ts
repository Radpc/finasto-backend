import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { GetTagByIdService } from './get-tag-by-id.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('tags')
@ApiTags('Tag')
export class GetTagByIdController {
  constructor(private readonly getTagByIdService: GetTagByIdService) {}

  @Get(':tagId')
  async handle(
    @Param('tagId') tagId: string,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<TagDTO> {
    const result = await this.getTagByIdService.execute({
      tagId,
      requesterId: req.user.id,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
