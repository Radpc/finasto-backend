import { UpdatePaymentDTO } from '../../dto/update-payment.dto';
import { Injectable } from '@nestjs/common';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { PaymentDomain } from '../../domain/payment.domain';

type Input = {
  familyId: string;
  paymentId: string;
  payload: UpdatePaymentDTO;
};
type Output = PaymentDomain;

@Injectable()
export class UpdatePaymentService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute(input: Input): Promise<Output> {
    const { familyId, payload, paymentId } = input;

    const res = await this.paymentRepoService.updatePayment(familyId, {
      where: { id: paymentId },
      data: {
        categoryId: payload.categoryId || undefined,
        tagIds: payload.tagIds,
        description: payload.description || undefined,
        observation: payload.observation || undefined,
        paymentDate: payload.paymentDate || undefined,
        paymentMethod: payload.paymentMethod || undefined,
        status: payload.status || undefined,
        value: payload.value || undefined,
      },
    });

    return res;
  }
}
