import { RecurringPaymentDomain } from '../../domain/recurring-payment.domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';
import { UserDTO } from 'src/modules/user/dto/user.dto';

type Input = {
  requester: UserDTO;
  recurringPaymentId: string;
};

type Output = RecurringPaymentDomain;

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
          family: { users: { some: { id: input.requester.id } } },
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

    return result;
  }
}
