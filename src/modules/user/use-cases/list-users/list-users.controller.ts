import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerResponse, PaginatedResponse } from 'src/types/response';
import { toPage } from 'src/common/pagination';
import { UserDTO } from '../../dto/user.dto';
import { ListUsersService } from './list-users.service';
import { ListUsersQuery } from './list-users.dto';
import {
  FamilyId,
  FamilyScoped,
} from 'src/common/family/family-scoped.decorator';

@FamilyScoped()
@Controller('users')
@ApiTags('User')
export class ListUsersController {
  constructor(private readonly listUsersService: ListUsersService) {}

  @Get()
  async handle(
    @FamilyId() familyId: string,
    @Query() query: ListUsersQuery,
  ): ControllerResponse<PaginatedResponse<UserDTO>> {
    const { data, total } = await this.listUsersService.execute({
      familyId,
      query,
    });
    return toPage(
      data.map((d) => d.toDTO()),
      total,
      query,
    );
  }
}
