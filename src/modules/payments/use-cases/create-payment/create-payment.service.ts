import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDTO } from '../../dto/create-payment.dto';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';
import { PaymentDomain } from '../../domain/payment.domain';

type Input = {
  payload: CreatePaymentDTO;
  requesterId: string;
};

type Output = {
  data: PaymentDomain;
  message: 'Success';
};

@Injectable()
export class CreatePaymentService {
  constructor(
    private paymentRepository: PaymentRepoService,
    private categoryRepository: CategoryRepoService,
    private tagRepository: TagRepoService,
  ) {}

  async execute(input: Input): Promise<Output> {
    // Check category
    const category = await this.categoryRepository.getCategory({
      id: input.payload.categoryId,
      family: { users: { some: { id: input.requesterId } } },
    });

    if (!category) throw new NotFoundException('Category not found');

    // Check tags
    if (input.payload.tagIds) {
      const res = await this.tagRepository.getTags({
        skip: 0,
        take: input.payload.tagIds.length,
        where: {
          id: { in: input.payload.tagIds },
          family: {
            users: { some: { id: input.requesterId } },
          },
        },
      });

      if (res.total !== input.payload.tagIds.length) {
        throw new NotFoundException('Tag not found');
      }
    }

    const result = await this.paymentRepository.createPayment({
      account: {
        connect: {
          id: input.payload.accountId,
          family: { users: { some: { id: input.requesterId } } },
        },
      },
      paymentDate: input.payload.paymentDate,
      description: input.payload.description,
      createdBy: { connect: { id: input.requesterId } },
      category: { connect: { id: input.payload.categoryId } },
      status: input.payload.status,
      paymentMethod: input.payload.paymentMethod,
      value: input.payload.value,
      observation: input.payload.observation,
      tags: {
        connect: input.payload.tagIds?.map((tagId) => ({ id: tagId })),
      },
    });

    return { data: result, message: 'Success' };
  }
}
