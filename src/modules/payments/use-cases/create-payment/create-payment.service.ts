import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDTO } from '../../dto/create-payment.dto';
import { PaymentRepoService } from 'src/database/repositories/payment/payment-repo.service';
import { CategoryRepoService } from 'src/database/repositories/category/category-repo.service';
import { TagRepoService } from 'src/database/repositories/tag/tag-repo.service';

@Injectable()
export class CreatePaymentService {
  constructor(
    private paymentRepository: PaymentRepoService,
    private categoryRepository: CategoryRepoService,
    private tagRepository: TagRepoService,
  ) {}

  async execute(createPaymentDTO: CreatePaymentDTO, requesterId: string) {
    // Check category
    const category = await this.categoryRepository.getCategory({
      id: createPaymentDTO.categoryId,
    });

    if (!category) throw new NotFoundException('Category not found');

    // Check tags
    if (createPaymentDTO.tagIds) {
      const res = await this.tagRepository.getTags({
        skip: 0,
        take: createPaymentDTO.tagIds.length,
        where: { id: { in: createPaymentDTO.tagIds } },
      });

      if (res.total !== createPaymentDTO.tagIds.length) {
        throw new NotFoundException('Tag not found');
      }
    }

    return this.paymentRepository.createPayment({
      description: createPaymentDTO.description,
      createdBy: { connect: { id: requesterId } },
      category: { connect: { id: createPaymentDTO.categoryId } },
      status: createPaymentDTO.status,
      paymentMethod: createPaymentDTO.paymentMethod,
      value: createPaymentDTO.value,
      observation: createPaymentDTO.observation,
      tags: {
        connect: createPaymentDTO.tagIds?.map((tagId) => ({ id: tagId })),
      },
    });
  }
}
