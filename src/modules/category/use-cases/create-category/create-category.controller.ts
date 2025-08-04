import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDTO } from '../../dto/create-category.dto';
import { CreateCategoryService } from './create-category.service';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';

@Controller('categories')
@ApiTags('Category')
export class CreateCategoryController {
  constructor(private readonly createCategory: CreateCategoryService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Post()
  async handle(
    @Body() createCategoryDto: CreateCategoryDTO,
    @Req() req: UserRequest,
  ) {
    const res = await this.createCategory.execute({
      payload: createCategoryDto,
      requesterId: req.requester.userId,
    });
    return { data: res.data.toDTO(), message: 'Category created' };
  }
}
