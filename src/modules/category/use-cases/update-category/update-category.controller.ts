import { Controller, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UpdateCategoryService } from './update-category.service';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';

@Controller('categories')
@ApiTags('Category')
export class UpdateCategoryController {
  constructor(private readonly categoriesService: UpdateCategoryService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Patch(':id')
  handle(
    @Param('id') id: string,
    @Req() req: UserRequest,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.execute({
      categoryId: id,
      payload: updateCategoryDto,
      requesterId: req.requester.userId,
    });
  }
}
