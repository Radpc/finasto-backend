import { Injectable } from '@nestjs/common';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';
import { CategoryDomain } from '../../domain/category.domain';
import { PaginatedList } from 'src/types/utils';

type FindAllInput = {
  page: number;
  pageSize: number;
  label?: string;
};

type Input = {
  familyId: string;
  query: FindAllInput;
};
type Output = PaginatedList<CategoryDomain>;

@Injectable()
export class ListCategoriesService {
  constructor(private categoryRepository: CategoryRepoService) {}

  async execute({ familyId, query }: Input): Promise<Output> {
    const take = query.pageSize;
    const skip = take * (query.page - 1);

    const result = await this.categoryRepository.categories(familyId, {
      where: {
        label: query.label ? { contains: query.label } : undefined,
      },
      skip,
      take,
    });

    return result;
  }
}
