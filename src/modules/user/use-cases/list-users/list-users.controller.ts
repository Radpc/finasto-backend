import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { toPage } from 'src/common/pagination';
import { UserDTO } from '../../dto/user.dto';
import { ListUsersService } from './list-users.service';
import { ListUsersQuery } from './list-users.dto';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('users')
@ApiTags('User')
export class ListUsersController {
  constructor(private readonly listUsersService: ListUsersService) {}

  @Get()
  async handle(
    @Query() query: ListUsersQuery,
    @Req() req: AuthorizedRequest,
  ): ControllerResponse<PaginatedResponse<UserDTO>> {
    const { data, total } = await this.listUsersService.execute({
      query,
      requester: req.user,
    });
    return toPage(
      data.map((d) => d.toDTO()),
      total,
      query,
    );
  }
}
