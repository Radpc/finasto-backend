import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';
import { CategoryDomain } from '../../domain/category.domain';

type Input = {
  categoryId: string;
  requesterId: string;
};

type Output = {
  data: CategoryDomain;
  message: 'Success';
};

@Injectable()
export class GetCategoryByIdService {
  constructor(private categoryRepository: CategoryRepoService) {}

  async execute(input: Input): Promise<Output> {
    const category = await this.categoryRepository.getCategory({
      id: input.categoryId,
      family: { users: { some: { id: input.requesterId } } },
    });

    if (!category) throw new NotFoundException();

    return { data: category, message: 'Success' };
  }
}
