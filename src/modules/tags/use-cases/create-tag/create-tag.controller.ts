import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTagService } from './create-tag.service';
import { UserGuard } from 'src/modules/jwt/user-jwt/user.guard';
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
  async handle(@Body() createTagDTO: CreateTagDTO): ControllerResponse<TagDTO> {
    const result = await this.createTagService.execute({ createTagDTO });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
