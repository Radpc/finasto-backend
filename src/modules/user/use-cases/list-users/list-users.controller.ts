import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard, UserRequest } from 'src/modules/jwt/user-jwt/user.guard';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { UserDTO } from '../../dto/user.dto';
import { ListUsersService } from './list-users.service';
import { ListUsersQuery } from './list-users.dto';

@UseGuards(UserGuard)
@ApiBearerAuth()
@Controller('users')
@ApiTags('User')
export class ListUsersController {
  constructor(private readonly listUsersService: ListUsersService) {}

  @Get()
  async handle(
    @Query() query: ListUsersQuery,
    @Req() req: UserRequest,
  ): ControllerResponse<PaginatedResponse<UserDTO>> {
    const { data, total } = await this.listUsersService.execute({
      query,
      requester: req.requester,
    });
    return {
      data: {
        items: data.map((d) => d.toDTO()),
        pagination: { page: query.page, total: total },
      },
      message: 'Success',
    };
  }
}
