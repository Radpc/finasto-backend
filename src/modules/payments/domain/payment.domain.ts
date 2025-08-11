import {
  Account,
  Category,
  Payment,
  RecurringPayment,
  Tag,
} from '@prisma/client';
import { CategoryDomain } from 'src/modules/category/domain/category.domain';
import { TagDomain } from 'src/modules/tags/domain/tag.domain';
import { PaymentDTO } from '../dto/payment.dto';
import { AccountDomain } from 'src/modules/account/domain/account.domain';
import { RecurringPaymentDomain } from 'src/modules/recurring-payments/domain/recurring-payment.domain';

export enum PaymentStatus {
  Paid = 'Paid',
  Pending = 'Pending',
  Predicted = 'Predicted',
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

  account?: AccountDomain;
  category?: CategoryDomain;
  tags?: TagDomain[];
  recurringPayment?: RecurringPaymentDomain;
}

type PaymentWithIncludes = Payment & {
  account?: Account;
  category?: Category;
  tags?: Tag[];
  recurringPayment?: RecurringPayment;
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

  account?: AccountDomain;
  category?: CategoryDomain;
  tags?: TagDomain[];
  recurringPayment?: RecurringPaymentDomain;

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

    this.account = props.account;
    this.category = props.category;
    this.tags = props.tags;
    this.recurringPayment = props.recurringPayment;
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
      account: paymentRaw.account
        ? AccountDomain.fromRaw(paymentRaw.account)
        : undefined,
      category: paymentRaw.category
        ? CategoryDomain.fromRaw(paymentRaw.category)
        : undefined,
      tags: paymentRaw.tags
        ? paymentRaw.tags.map(TagDomain.fromRaw)
        : undefined,
      recurringPayment: paymentRaw.recurringPayment
        ? RecurringPaymentDomain.fromRaw(paymentRaw.recurringPayment)
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
      account: this.account?.toDTO(),
      category: this.category?.toDTO(),
      tags: this.tags?.map((t) => t.toDTO()),
      recurringPayment: this.recurringPayment?.toDTO(),
    });
  }
}
