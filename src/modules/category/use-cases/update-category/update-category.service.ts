import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';

type Input = {
  familyId: string;
  categoryId: string;
  payload: UpdateCategoryDto;
};
type Output = Awaited<ReturnType<CategoryRepoService['updateCategory']>>;

@Injectable()
export class UpdateCategoryService {
  constructor(private categoryRepository: CategoryRepoService) {}

  async execute(input: Input): Promise<Output> {
    return this.categoryRepository.updateCategory(input.familyId, {
      data: input.payload,
      where: { id: input.categoryId },
    });
  }
}
