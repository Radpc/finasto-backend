import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCategoryByIdService } from './get-category-by-id.service';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';

@Controller('categories')
@ApiTags('Category')
export class GetCategoryByIdController {
  constructor(private readonly getCategory: GetCategoryByIdService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get(':id')
  async handle(@Param('id') id: string, @Req() req: UserRequest) {
    const { data: category } = await this.getCategory.execute({
      categoryId: id,
      requesterId: req.jwtPayload.userId,
    });

    if (!category) throw new NotFoundException('Category not found');

    return { data: category.toDTO() };
  }
}
