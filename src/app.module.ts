import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './modules/category/categories.module';
import { PrismaModule } from './database/prisma.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { JwtModule as OriginalJwtModule } from '@nestjs/jwt';
import { JwtModule } from './modules/jwt/jwt.module';
import { UsersModule } from './modules/user/users.module';
import { TagsModule } from './modules/tags/tags.module';
import { AccountModule } from './modules/account/account.module';
import { FamilyModule } from './modules/family/family.module';
import { RecurringPaymentsModule } from './modules/recurring-payments/recurring-payments.module';
import { TimeBudgetModule } from './modules/time-budget/time-budget.module';
import { LoggingModule } from './modules/logger/logger.module';
import { HealthModule } from './modules/health/health.module';
import { validateEnv } from './config/env.validation';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

@Module({
  imports: [
    LoggingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
      validate: validateEnv,
    }),
    ScheduleModule.forRoot(),
    // Default limit for every route; stricter limits are set per route.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    OriginalJwtModule.register({
      global: true,
    }),
    JwtModule,
    PrismaModule,
    PaymentsModule,
    CategoriesModule,
    TagsModule,
    UsersModule,
    AccountModule,
    FamilyModule,
    RecurringPaymentsModule,
    TimeBudgetModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, transform: true }),
    },
  ],
})
export class AppModule {}
