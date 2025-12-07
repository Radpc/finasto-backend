import { Controller, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { UpdateCategoryService } from './update-category.service';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';
@Controller('categories')
@ApiTags('Category')
export class UpdateCategoryController {
  constructor(private readonly categoriesService: UpdateCategoryService) {}

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Patch(':id')
  handle(
    @Param('id') id: string,
    @Req() req: AuthorizedRequest,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.execute({
      categoryId: id,
      payload: updateCategoryDto,
      requesterId: req.user.id,
    });
  }
}
