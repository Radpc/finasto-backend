import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    LoggingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
      validate: validateEnv,
    }),
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
  providers: [],
})
export class AppModule {}
