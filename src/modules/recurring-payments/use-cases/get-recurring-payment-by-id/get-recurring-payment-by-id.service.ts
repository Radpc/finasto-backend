import { Requester } from 'src/modules/jwt/user-jwt/user-jwt.service';
import { RecurringPaymentDomain } from '../../domain/recurring-payment.domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';

type Input = {
  requester: Requester;
  recurringPaymentId: string;
};

type Output = {
  data: RecurringPaymentDomain;
  message: 'Success';
};

@Injectable()
export class GetRecurringPaymentByIdService {
  constructor(
    private readonly recurringPaymentRepoService: RecurringPaymentRepoService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const result = await this.recurringPaymentRepoService.getRecurringPayment({
      where: {
        id: input.recurringPaymentId,
        account: {
          family: { users: { some: { id: input.requester.userId } } },
        },
      },
      include: {
        account: true,
        category: true,
        tags: true,
        createdBy: true,
      },
    });

    if (!result) throw new NotFoundException();

    return { data: result, message: 'Success' };
  }
}
