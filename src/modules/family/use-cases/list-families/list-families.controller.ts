import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { PaginatedQuery } from 'src/types/paginated-dto';
import { FamilyDTO } from '../../dto/family.dto';
import { ListFamiliesService } from './list-families.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

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

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Get()
  async handle(
    @Query() query: GetFamiliesParams,
    @Req() req: AuthorizedRequest,
  ): IResponse {
    const result = await this.listFamiliesService.execute({
      query: {
        page: query.page,
        pageSize: query.pageSize,
        name: query.name,
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
