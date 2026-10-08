import { Injectable } from '@nestjs/common';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';
import { CreateCategoryDTO } from '../../dto/create-category.dto';
import { CategoryDomain } from '../../domain/category.domain';

type Input = {
  familyId: string;
  payload: CreateCategoryDTO;
};
type Output = CategoryDomain;

@Injectable()
export class CreateCategoryService {
  constructor(private categoryRepository: CategoryRepoService) {}

  async execute(input: Input): Promise<Output> {
    return this.categoryRepository.createCategory(input.familyId, {
      label: input.payload.label,
    });
  }
}
