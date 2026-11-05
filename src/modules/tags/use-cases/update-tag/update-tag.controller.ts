import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { UpdateTagService } from './update-tag.service';
import { UpdateTagDTO } from '../../dto/update-tag.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('tags')
@ApiTags('Tag')
export class UpdateTagController {
  constructor(private readonly updateTagService: UpdateTagService) {}

  @Put(':tagId')
  async handle(
    @Body() updateTagDTO: UpdateTagDTO,
    @Req() req: AuthorizedRequest,
    @Param('tagId') tagId: string,
  ): ControllerResponse<TagDTO> {
    const result = await this.updateTagService.execute({
      tagId,
      updateTagDTO,
      requesterId: req.user.id,
    });
    return result.toDTO();
  }
}
