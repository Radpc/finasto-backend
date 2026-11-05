import { Controller, Get, Query } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { PaginatedQuery } from 'src/types/paginated-dto';
import { ListCategoriesService } from './list-categories.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { toPage } from 'src/common/pagination';
import { CategoryDTO } from '../../dto/category.dto';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

export class GetCategoriesParams extends PaginatedQuery {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Exemplo', required: false })
  searchBy?: string;
}

type IResponse = ControllerResponse<PaginatedResponse<CategoryDTO>>;

@Controller('categories')
@ApiTags('Category')
export class ListCategoriesController {
  constructor(private readonly listCategoriesService: ListCategoriesService) {}

  @FamilyScoped()
  @Get()
  async handle(
    @FamilyId() familyId: string,
    @Query() query: GetCategoriesParams,
  ): IResponse {
    const result = await this.listCategoriesService.execute({
      familyId,
      query: {
        page: query.page,
        pageSize: query.pageSize,
        label: query.searchBy,
      },
    });

    return toPage(
      result.data.map((c) => c.toDTO()),
      result.total,
      query,
    );
  }
}
