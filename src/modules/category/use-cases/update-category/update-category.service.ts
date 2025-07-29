import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';

@Injectable()
export class UpdateCategoryService {
  constructor(private categoryRepository: CategoryRepoService) {}

  execute(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.updateCategory({
      data: updateCategoryDto,
      where: { id },
    });
  }
}
