import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { FamilyDTO } from '../../dto/family.dto';
import { GetFamilyByIdService } from './get-family-by-id.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('families')
@ApiTags('Family')
export class GetFamilyByIdController {
  constructor(private readonly getFamilyByIdService: GetFamilyByIdService) {}

  @Get(':familyId')
  async handle(
    @Param('familyId') familyId: string,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<FamilyDTO> {
    const result = await this.getFamilyByIdService.execute({
      familyId,
      requesterId: req.user.id,
    });

    return result.toDTO();
  }
}
