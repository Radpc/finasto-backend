import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { FamilyDTO } from '../../dto/family.dto';
import { GetFamilyByIdService } from './get-family-by-id.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('families')
@ApiTags('Family')
export class CreateFamilyController {
  constructor(private readonly getFamilyByIdService: GetFamilyByIdService) {}

  @Get(':familyId')
  async handle(
    @Param('familyId') familyId: string,
    @Req() req: UserRequest,
  ): ControllerResponse<FamilyDTO> {
    const result = await this.getFamilyByIdService.execute({
      familyId,
      requesterId: req.jwtPayload.userId,
    });

    return { data: result.data.toDTO(), message: 'Success' };
  }
}
