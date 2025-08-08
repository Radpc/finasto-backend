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
import { GetPaymentValueSumController } from './use-cases/get-payment-value-sum/get-payment-value-sum.controller';
import { GetPaymentValueSumService } from './use-cases/get-payment-value-sum/get-payment-value-sum.service';
import { UpdatePaymentController } from './use-cases/update-payment/update-payment.controller';
import { UpdatePaymentService } from './use-cases/update-payment/update-payment.service';
import { GetPaymentByIdService } from './use-cases/get-payment-by-id/get-payment-by-id.service';
import { GetPaymentByIdController } from './use-cases/get-payment-by-id/get-payment-by-id.controller';

@Module({
  controllers: [
    CreatePaymentController,
    ListPaymentsController,
    RemovePaymentController,
    GetPaymentValueSumController,
    GetPaymentByIdController,
    UpdatePaymentController,
  ],
  providers: [
    CategoryRepoService,
    CreatePaymentService,
    ListPaymentsService,
    RemovePaymentService,
    GetPaymentValueSumService,
    GetPaymentByIdService,
    UpdatePaymentService,

    // Repos
    PrismaService,
    TagRepoService,
    PaymentRepoService,
  ],
})
export class PaymentsModule {}
