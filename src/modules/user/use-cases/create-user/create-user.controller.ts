import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from '../../dto/create-user.dto';
import { UserDTO } from '../../dto/user.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('users')
@ApiTags('User')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  async handle(
    @Body() createUserDTO: CreateUserDTO,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<UserDTO> {
    const result = await this.createUserService.execute({
      payload: createUserDTO,
      requester: req.user,
    });
    return result.toDTO();
  }
}
