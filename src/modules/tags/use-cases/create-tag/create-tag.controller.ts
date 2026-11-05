import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTagService } from './create-tag.service';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { CreateTagDTO } from '../../dto/create-tag.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('tags')
@ApiTags('Tag')
export class CreateTagController {
  constructor(private readonly createTagService: CreateTagService) {}

  @Post()
  async handle(
    @Body() createTagDTO: CreateTagDTO,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<TagDTO> {
    const result = await this.createTagService.execute({
      createTagDTO,
      requesterId: req.user.id,
    });
    return result.toDTO();
  }
}
