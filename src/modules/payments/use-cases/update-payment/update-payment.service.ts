import { UpdatePaymentDTO } from '../../dto/update-payment.dto';
import { Injectable } from '@nestjs/common';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { PaymentDomain } from '../../domain/payment.domain';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  paymentId: string;
  payload: UpdatePaymentDTO;
  requester: UserDTO;
};
type Output = {
  data: PaymentDomain;
  message: 'Success';
};

@Injectable()
export class UpdatePaymentService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute(input: Input): Promise<Output> {
    const { payload, paymentId, requester } = input;

    const res = await this.paymentRepoService.updatePayment({
      where: {
        id: paymentId,
        account: { family: { users: { some: { id: requester.id } } } },
      },
      data: {
        category: payload.categoryId
          ? {
              connect: {
                id: payload.categoryId,
                family: { users: { some: { id: requester.id } } },
              },
            }
          : undefined,
        tags: payload.tagIds
          ? {
              connect: payload.tagIds.map((tagId) => ({
                id: tagId,
                family: { users: { some: { id: requester.id } } },
              })),
            }
          : undefined,
        description: payload.description || undefined,
        observation: payload.observation || undefined,
        paymentDate: payload.paymentDate || undefined,
        paymentMethod: payload.paymentMethod || undefined,
        status: payload.status || undefined,
        value: payload.value || undefined,
      },
    });

    return {
      data: res,
      message: 'Success',
    };
  }
}
