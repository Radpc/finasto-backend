import { Injectable } from '@nestjs/common';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';
import { CreateCategoryDTO } from '../../dto/create-category.dto';
import { CategoryDomain } from '../../domain/category.domain';

type Input = {
  payload: CreateCategoryDTO;
  requesterId: string;
};
type Output = {
  data: CategoryDomain;
  message: 'Success';
};

@Injectable()
export class CreateCategoryService {
  constructor(private categoryRepository: CategoryRepoService) {}

  async execute(input: Input): Promise<Output> {
    const res = await this.categoryRepository.createCategory({
      label: input.payload.label,
      family: {
        connect: {
          id: input.payload.familyId,
          users: { some: { id: input.requesterId } },
        },
      },
    });

    return {
      data: res,
      message: 'Success',
    };
  }
}
