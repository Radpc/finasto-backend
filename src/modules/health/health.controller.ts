import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/database/prisma.service';
import { RawResponse } from 'src/common/http/raw-response.decorator';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @RawResponse()
  async handle() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
