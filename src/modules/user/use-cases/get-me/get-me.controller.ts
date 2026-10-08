import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiKeyAndJwtGuard } from 'src/modules/jwt/guards/shared.guard';
import { AuthorizedRequest } from 'src/modules/jwt/authorized-request.type';
import { ControllerResponse } from 'src/types/response';
import { UserDTO } from '../../dto/user.dto';
import { GetMeService } from './get-me.service';

@UseGuards(ApiKeyAndJwtGuard)
@ApiBearerAuth()
@Controller('me')
@ApiTags('User')
export class GetMeController {
  constructor(private readonly getMeService: GetMeService) {}

  @Get()
  @ApiOperation({ summary: 'The signed-in user and their families' })
  async handle(@Req() req: AuthorizedRequest): ControllerResponse<UserDTO> {
    const result = await this.getMeService.execute({
      requesterId: req.user.id,
    });
    return result.toDTO();
  }
}
