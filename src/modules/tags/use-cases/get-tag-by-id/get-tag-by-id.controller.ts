import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { TagDTO } from '../../dto/tag.dto';
import { GetTagByIdService } from './get-tag-by-id.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('tags')
@ApiTags('Tag')
export class GetTagByIdController {
  constructor(private readonly getTagByIdService: GetTagByIdService) {}

  @Get(':tagId')
  async handle(
    @Param('tagId') tagId: string,
    @Req() req: UserRequest,
  ): ControllerResponse<TagDTO> {
    const result = await this.getTagByIdService.execute({
      tagId,
      requesterId: req.requester.userId,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
