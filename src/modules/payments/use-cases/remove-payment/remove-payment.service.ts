import { Injectable } from '@nestjs/common';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { PaymentDomain } from '../../domain/payment.domain';

type Input = {
  familyId: string;
  paymentId: string;
};
type Output = PaymentDomain;

@Injectable()
export class RemovePaymentService {
  constructor(private paymentRepository: PaymentRepoService) {}

  async execute(input: Input): Promise<Output> {
    const deletedPayment = await this.paymentRepository.deletePayment(
      input.familyId,
      {
        id: input.paymentId,
      },
    );

    return deletedPayment;
  }
}
