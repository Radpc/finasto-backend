import { RecurringPaymentDomain } from '../../domain/recurring-payment.domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RecurringPaymentRepoService } from 'src/database/repositories/recurring-payment/recurring-payment-repo.service';

type Input = {
  familyId: string;
  recurringPaymentId: string;
};

type Output = RecurringPaymentDomain;

@Injectable()
export class GetRecurringPaymentByIdService {
  constructor(
    private readonly recurringPaymentRepoService: RecurringPaymentRepoService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const result = await this.recurringPaymentRepoService.getRecurringPayment(
      input.familyId,
      {
        where: { id: input.recurringPaymentId },
        include: {
          account: true,
          category: true,
          tags: true,
          createdBy: true,
        },
      },
    );

    if (!result) throw new NotFoundException();

    return result;
  }
}
