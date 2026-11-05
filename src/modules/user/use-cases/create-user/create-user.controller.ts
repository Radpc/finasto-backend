import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse } from 'src/types/response';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { UserDTO } from '../../dto/user.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('users')
@ApiTags('User')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  async handle(
    @FamilyId() familyId: string,
    @Body() createUserDTO: CreateUserDTO,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<UserDTO> {
    const result = await this.createUserService.execute({
      familyId,
      payload: createUserDTO,
      requester: req.user,
    });
    return result.toDTO();
  }
}
