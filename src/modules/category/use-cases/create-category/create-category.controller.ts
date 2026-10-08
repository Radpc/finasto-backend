import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDTO } from '../../dto/create-category.dto';
import { CreateCategoryService } from './create-category.service';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@Controller('categories')
@ApiTags('Category')
export class CreateCategoryController {
  constructor(private readonly createCategory: CreateCategoryService) {}

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Post()
  async handle(
    @Body() createCategoryDto: CreateCategoryDTO,
    @Req() req: AuthorizedRequest,
  ) {
    const res = await this.createCategory.execute({
      payload: createCategoryDto,
      requesterId: req.user.id,
    });
    return res.toDTO();
  }
}
