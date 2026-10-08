import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { UserDTO } from '../../dto/user.dto';
import { GetUserByIdService } from './get-user-by-id.service';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('users')
@ApiTags('User')
export class GetUserByIdController {
  constructor(private readonly getUserByIdService: GetUserByIdService) {}

  @Get(':userId')
  async handle(
    @FamilyId() familyId: string,
    @Param('userId') userId: string,
  ): ControllerResponse<UserDTO> {
    const result = await this.getUserByIdService.execute({
      familyId,
      userId,
    });
    return result.toDTO();
  }
}
