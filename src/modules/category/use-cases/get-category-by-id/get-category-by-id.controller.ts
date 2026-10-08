import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCategoryByIdService } from './get-category-by-id.service';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@Controller('categories')
@ApiTags('Category')
export class GetCategoryByIdController {
  constructor(private readonly getCategory: GetCategoryByIdService) {}

  @UseGuards(ApiKeyAndJwtGuard)
  @ApiBearerAuth()
  @Get(':id')
  async handle(@Param('id') id: string, @Req() req: AuthorizedRequest) {
    const category = await this.getCategory.execute({
      categoryId: id,
      requesterId: req.user.id,
    });

    return category.toDTO();
  }
}
