import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDTO } from '../../dto/create-category.dto';
import { CreateCategoryService } from './create-category.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@Controller('categories')
@ApiTags('Category')
export class CreateCategoryController {
  constructor(private readonly createCategory: CreateCategoryService) {}

  @FamilyScoped()
  @Post()
  async handle(
    @FamilyId() familyId: string,
    @Body() createCategoryDto: CreateCategoryDTO,
  ) {
    const res = await this.createCategory.execute({
      familyId,
      payload: createCategoryDto,
    });
    return res.toDTO();
  }
}
