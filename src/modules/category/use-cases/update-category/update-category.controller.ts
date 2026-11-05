import { Controller, Body, Patch, Param } from '@nestjs/common';
import { UpdateCategoryService } from './update-category.service';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';
@Controller('categories')
@ApiTags('Category')
export class UpdateCategoryController {
  constructor(private readonly categoriesService: UpdateCategoryService) {}

  @FamilyScoped()
  @Patch(':id')
  async handle(
    @FamilyId() familyId: string,
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoriesService.execute({
      familyId,
      categoryId: id,
      payload: updateCategoryDto,
    });
    return category.toDTO();
  }
}
