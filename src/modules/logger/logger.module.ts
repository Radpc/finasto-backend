import { Global, Module } from '@nestjs/common';
import { AppLogger } from './providers/logger.service';

@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggingModule {}
