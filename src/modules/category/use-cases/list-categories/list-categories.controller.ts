import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ListCategoriesService } from './list-categories.service';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { CategoryDTO } from '../../dto/category.dto';

export class GetCategoriesParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number, example: 1, required: true })
  page: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @ApiProperty({ type: Number, example: 1, required: true })
  pageSize: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Exemplo', required: false })
  label?: string;
}

type IResponse = ControllerResponse<PaginatedResponse<CategoryDTO>>;

@Controller('categories')
@ApiTags('Category')
export class ListCategoriesController {
  constructor(private readonly listCategoriesService: ListCategoriesService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get()
  async handle(
    @Query() query: GetCategoriesParams,
    @Req() req: UserRequest,
  ): IResponse {
    const result = await this.listCategoriesService.execute({
      query: {
        page: query.page,
        pageSize: query.pageSize,
        label: query.label,
      },
      requesterId: req.requester.userId,
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
