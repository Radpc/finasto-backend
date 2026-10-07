import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { PaginatedQuery } from 'src/types/paginated-dto';
import { ListCategoriesService } from './list-categories.service';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { CategoryDTO } from '../../dto/category.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

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

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Get()
  async handle(
    @Query() query: GetCategoriesParams,
    @Req() req: AuthorizedRequest,
  ): IResponse {
    const result = await this.listCategoriesService.execute({
      query: {
        page: query.page,
        pageSize: query.pageSize,
        label: query.searchBy,
      },
      requesterId: req.user.id,
    });

    return {
      data: {
        items: result.data.data.map((c) => c.toDTO()),
        pagination: { page: query.page, total: result.data.total },
      },
      message: 'Success',
    };
  }
}
