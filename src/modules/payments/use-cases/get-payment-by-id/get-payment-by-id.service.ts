import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentDomain } from '../../domain/payment.domain';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';

type Input = {
  familyId: string;
  paymentId: string;
};

type Output = PaymentDomain;

@Injectable()
export class GetPaymentByIdService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute(input: Input): Promise<Output> {
    const res = await this.paymentRepoService.getPayment(input.familyId, {
      where: { id: input.paymentId },
      include: {
        category: true,
        tags: true,
        account: true,
        createdBy: true,
        recurringPayment: true,
      },
    });

    if (!res) throw new NotFoundException();

    return res;
  }
}
