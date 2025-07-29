import { Category, Payment, Tag } from '@prisma/client';
import { CategoryDomain } from 'src/modules/category/domain/category.domain';
import { TagDomain } from 'src/modules/tags/domain/tag.domain';
import { PaymentDTO } from '../dto/payment.dto';

export enum PaymentStatus {
  Paid = 'Paid',
}

export enum PaymentMethod {
  Credit = 'Credit',
  Debit = 'Debit',
  Cash = 'Cash',
  Pix = 'Pix',
}

interface IProps {
  id: string;
  description: string;
  value: number;
  observation?: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;

  category?: CategoryDomain;
  tags?: TagDomain[];
}

type PaymentWithIncludes = Payment & {
  category?: Category;
  tags?: Tag[];
};

export class PaymentDomain {
  id: string;
  description: string;
  value: number;
  observation?: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  createdAt: Date;
  updatedAt: Date;

  category?: CategoryDomain;
  tags?: TagDomain[];

  constructor(props: IProps) {
    this.id = props.id;
    this.description = props.description;
    this.value = props.value;
    this.observation = props.observation;
    this.status = props.status;
    this.paymentDate = props.paymentDate;
    this.paymentMethod = props.paymentMethod;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.category = props.category;
    this.tags = props.tags;
  }

  static fromRaw(paymentRaw: PaymentWithIncludes) {
    return new PaymentDomain({
      id: paymentRaw.id,
      description: paymentRaw.description,
      observation: paymentRaw.observation || undefined,
      status: (paymentRaw.status as PaymentStatus) || undefined,
      paymentMethod: (paymentRaw.paymentMethod as PaymentMethod) || undefined,
      value: paymentRaw.value,
      paymentDate: paymentRaw.paymentDate,
      createdAt: paymentRaw.createdAt,
      updatedAt: paymentRaw.updatedAt,
      category: paymentRaw.category
        ? CategoryDomain.fromRaw(paymentRaw.category)
        : undefined,
      tags: paymentRaw.tags
        ? paymentRaw.tags.map(TagDomain.fromRaw)
        : undefined,
    });
  }
  toDTO() {
    return new PaymentDTO({
      id: this.id,
      description: this.description,
      observation: this.observation,
      status: this.status,
      paymentMethod: this.paymentMethod,
      value: this.value,
      paymentDate: this.paymentDate.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      category: this.category?.toDTO(),
      tags: this.tags?.map((t) => t.toDTO()),
    });
  }
}
