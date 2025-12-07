import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse } from 'src/types/response';
import { UserDTO } from '../../dto/user.dto';
import { GetUserByIdService } from './get-user-by-id.service';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('users')
@ApiTags('User')
export class GetUserByIdController {
  constructor(private readonly getUserByIdService: GetUserByIdService) {}

  @Get(':userId')
  async handle(
    @Param('userId') userId: string,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<UserDTO> {
    const result = await this.getUserByIdService.execute({
      userId,
      requester: req.user,
    });
    return { data: result.data.toDTO(), message: 'Success' };
  }
}
