import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTagService } from './create-tag.service';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { CreateTagDTO } from '../../dto/create-tag.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('tags')
@ApiTags('Tag')
export class CreateTagController {
  constructor(private readonly createTagService: CreateTagService) {}

  @Post()
  async handle(
    @Body() createTagDTO: CreateTagDTO,
    @Req() req: UserRequest,
  ): ControllerResponse<TagDTO> {
    const result = await this.createTagService.execute({
      createTagDTO,
      requesterId: req.jwtPayload.userId,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
