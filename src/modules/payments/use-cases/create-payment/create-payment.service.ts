import { Injectable } from '@nestjs/common';
import { CreatePaymentDTO } from '../../dto/create-payment.dto';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { PaymentDomain } from '../../domain/payment.domain';

type Input = {
  familyId: string;
  payload: CreatePaymentDTO;
  requesterId: string;
};

type Output = PaymentDomain;

@Injectable()
export class CreatePaymentService {
  constructor(private paymentRepository: PaymentRepoService) {}

  /** The account, category and tags must belong to the family, or this is a 404. */
  async execute(input: Input): Promise<Output> {
    return this.paymentRepository.createPayment(input.familyId, {
      accountId: input.payload.accountId,
      categoryId: input.payload.categoryId,
      tagIds: input.payload.tagIds,
      paymentDate: input.payload.paymentDate,
      description: input.payload.description,
      createdBy: { connect: { id: input.requesterId } },
      status: input.payload.status,
      paymentMethod: input.payload.paymentMethod,
      value: input.payload.value,
      observation: input.payload.observation,
    });
  }
}
