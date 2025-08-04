import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { FamilyDTO } from '../../dto/family.dto';
import { CreateFamilyDTO } from '../../dto/create-family.dto';
import { CreateFamilyService } from './create-family.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('families')
@ApiTags('Family')
export class CreateFamilyController {
  constructor(private readonly createFamilyService: CreateFamilyService) {}

  @Post()
  async handle(
    @Body() body: CreateFamilyDTO,
    @Req() req: UserRequest,
  ): ControllerResponse<FamilyDTO> {
    const result = await this.createFamilyService.execute({
      payload: body,
      requesterId: req.requester.userId,
    });

    return { data: result.data.toDTO(), message: 'Success' };
  }
}
