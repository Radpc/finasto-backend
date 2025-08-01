import { Injectable } from '@nestjs/common';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { PaymentDomain } from '../../domain/payment.domain';

type Input = {
  paymentId: string;
  requesterId: string;
};
type Output = PaymentDomain;

@Injectable()
export class RemovePaymentService {
  constructor(private paymentRepository: PaymentRepoService) {}

  async execute(input: Input): Promise<Output> {
    const deletedPayment = await this.paymentRepository.deletePayment({
      id: input.paymentId,
      account: { family: { users: { some: { id: input.requesterId } } } },
    });

    return deletedPayment;
  }
}
