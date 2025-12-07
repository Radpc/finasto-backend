import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentDomain } from '../../domain/payment.domain';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  requester: UserDTO;
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
          family: { users: { some: { id: input.requester.id } } },
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
