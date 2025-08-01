import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { PaginatedQuery } from 'src/types/paginated-dto';
import { FamilyDTO } from '../../dto/family.dto';
import { ListFamiliesService } from './list-families.service';

export class GetFamiliesParams extends PaginatedQuery {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, example: 'Exemplo', required: false })
  name?: string;
}

type IResponse = ControllerResponse<PaginatedResponse<FamilyDTO>>;

@Controller('families')
@ApiTags('Family')
export class ListFamiliesController {
  constructor(private readonly listFamiliesService: ListFamiliesService) {}

  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @Get()
  async handle(
    @Query() query: GetFamiliesParams,
    @Req() req: UserRequest,
  ): IResponse {
    const result = await this.listFamiliesService.execute({
      query: {
        page: query.page,
        pageSize: query.pageSize,
        name: query.name,
      },
      requesterId: req.jwtPayload.userId,
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
