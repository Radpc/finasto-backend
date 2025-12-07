import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { FamilyDTO } from '../../dto/family.dto';
import { CreateFamilyDTO } from '../../dto/create-family.dto';
import { CreateFamilyService } from './create-family.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('families')
@ApiTags('Family')
export class CreateFamilyController {
  constructor(private readonly createFamilyService: CreateFamilyService) {}

  @Post()
  async handle(
    @Body() body: CreateFamilyDTO,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<FamilyDTO> {
    const result = await this.createFamilyService.execute({
      payload: body,
      requesterId: req.user.id,
    });

    return { data: result.data.toDTO(), message: 'Success' };
  }
}
