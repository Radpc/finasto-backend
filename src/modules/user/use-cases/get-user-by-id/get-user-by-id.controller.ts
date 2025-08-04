import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse } from 'src/types/response';
import { UserDTO } from '../../dto/user.dto';
import { GetUserByIdService } from './get-user-by-id.service';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('users')
@ApiTags('User')
export class GetUserByIdController {
  constructor(private readonly getUserByIdService: GetUserByIdService) {}

  @Get(':userId')
  async handle(
    @Param('userId') userId: string,
    @Req() req: UserRequest,
  ): ControllerResponse<UserDTO> {
    const result = await this.getUserByIdService.execute({
      userId,
      requester: req.requester,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
