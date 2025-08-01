import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { UpdateTagService } from './update-tag.service';
import { UpdateTagDTO } from '../../dto/update-tag.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('tags')
@ApiTags('Tag')
export class UpdateTagController {
  constructor(private readonly updateTagService: UpdateTagService) {}

  @Put(':tagId')
  async handle(
    @Body() updateTagDTO: UpdateTagDTO,
    @Req() req: UserRequest,
    @Param('tagId') tagId: string,
  ): ControllerResponse<TagDTO> {
    const result = await this.updateTagService.execute({
      tagId,
      updateTagDTO,
      requesterId: req.jwtPayload.userId,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
