import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { UserDTO } from '../../dto/user.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('users')
@ApiTags('User')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  async handle(
    @Body() createUserDTO: CreateUserDTO,
    @Req() req: UserRequest,
  ): ControllerResponse<UserDTO> {
    const result = await this.createUserService.execute({
      payload: createUserDTO,
      requester: req.requester,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
