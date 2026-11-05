import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';
import { CategoryDomain } from '../../domain/category.domain';

type Input = {
  familyId: string;
  categoryId: string;
};

type Output = CategoryDomain;

@Injectable()
export class GetCategoryByIdService {
  constructor(private categoryRepository: CategoryRepoService) {}

  async execute(input: Input): Promise<Output> {
    const category = await this.categoryRepository.getCategory(input.familyId, {
      id: input.categoryId,
    });

    if (!category) throw new NotFoundException();

    return category;
  }
}
