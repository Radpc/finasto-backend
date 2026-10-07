import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/database/prisma.service';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }
}
