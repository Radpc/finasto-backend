import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';
import { CreateRecurringPaymentController } from './use-cases/create-recurring-payment/create-recurring-payment.controller';
import { GetRecurringPaymentByIdController } from './use-cases/get-recurring-payment-by-id/get-recurring-payment-by-id.controller';
import { ListRecurringPaymentsController } from './use-cases/list-recurring-payments/list-recurring-payments.controller';
import { CreateRecurringPaymentService } from './use-cases/create-recurring-payment/create-recurring-payment.service';
import { GetRecurringPaymentByIdService } from './use-cases/get-recurring-payment-by-id/get-recurring-payment-by-id.service';
import { ListRecurringPaymentsService } from './use-cases/list-recurring-payments/list-recurring-payments.service';
import { CreatePaymentFromRecurringService } from './jobs/create-payment-from-recurring.service/create-payment-from-recurring.service';
import { CreatePaymentFromRecurringController } from './jobs/create-payment-from-recurring.service/create-payment-from-recurring.controller';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';

@Module({
  controllers: [
    CreateRecurringPaymentController,
    GetRecurringPaymentByIdController,
    ListRecurringPaymentsController,
    CreatePaymentFromRecurringController,
  ],
  providers: [
    PrismaService,
    CreateRecurringPaymentService,
    GetRecurringPaymentByIdService,
    ListRecurringPaymentsService,

    // Jobs
    CreatePaymentFromRecurringService,

    // Repo
    RecurringPaymentRepoService,
    PaymentRepoService,
  ],
})
export class RecurringPaymentsModule {}
