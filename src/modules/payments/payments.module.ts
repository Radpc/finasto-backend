import { Module } from '@nestjs/common';
import { CreatePaymentController } from './use-cases/create-payment/create-payment.controller';
import { CreatePaymentService } from './use-cases/create-payment/create-payment.service';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { PrismaService } from 'src/database/prisma.service';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';
import { ListPaymentsController } from './use-cases/list-payment/list-payments.controller';
import { ListPaymentsService } from './use-cases/list-payment/list-payments.service';
import { RemovePaymentController } from './use-cases/remove-payment/remove-payment.controller';
import { RemovePaymentService } from './use-cases/remove-payment/remove-payment.service';

@Module({
  controllers: [
    CreatePaymentController,
    ListPaymentsController,
    RemovePaymentController,
  ],
  providers: [
    PrismaService,
    PaymentRepoService,
    CategoryRepoService,
    TagRepoService,
    CreatePaymentService,
    ListPaymentsService,
    RemovePaymentService,
  ],
})
export class PaymentsModule {}
