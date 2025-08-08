import { Injectable, NotFoundException } from '@nestjs/common';
import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { PaymentDomain } from '../../domain/payment.domain';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';

type Input = {
  requester: Requester;
  paymentId: string;
};

type Output = {
  data: PaymentDomain;
  message: 'Success';
};

@Injectable()
export class GetPaymentByIdService {
  constructor(private readonly paymentRepoService: PaymentRepoService) {}

  async execute(input: Input): Promise<Output> {
    const res = await this.paymentRepoService.getPayment({
      where: {
        id: input.paymentId,
        account: {
          family: { users: { some: { id: input.requester.userId } } },
        },
      },
      include: {
        category: true,
        tags: true,
        account: true,
        createdBy: true,
        recurringPayment: true,
      },
    });

    if (!res) throw new NotFoundException();

    return {
      data: res,
      message: 'Success',
    };
  }
}
