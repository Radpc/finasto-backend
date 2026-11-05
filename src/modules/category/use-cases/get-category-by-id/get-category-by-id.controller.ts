import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCategoryByIdService } from './get-category-by-id.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@Controller('categories')
@ApiTags('Category')
export class GetCategoryByIdController {
  constructor(private readonly getCategory: GetCategoryByIdService) {}

  @FamilyScoped()
  @Get(':id')
  async handle(@FamilyId() familyId: string, @Param('id') id: string) {
    const category = await this.getCategory.execute({
      familyId,
      categoryId: id,
    });

    return category.toDTO();
  }
}
