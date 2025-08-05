import { Account, Category, Payment, RecurringPayment } from '@prisma/client';
import { AccountDomain } from 'src/modules/account/domain/account.domain';
import { CategoryDomain } from 'src/modules/category/domain/category.domain';
import {
  PaymentDomain,
  PaymentMethod,
} from 'src/modules/payments/domain/payment.domain';
import { RecurringPaymentDTO } from '../dto/recurring-payment.dto';

interface IProps {
  id: string;
  description: string;
  paymentMethod: PaymentMethod;
  totalValue?: number;
  automaticPayment: boolean;
  singlePaymentValue: number;
  numberOfInstallments?: number;
  dayOfMonth: number;

  createdAt: Date;
  updatedAt: Date;

  payments?: PaymentDomain[];
  account?: AccountDomain;
  category?: CategoryDomain;
}

type RecurringPaymentWithIncludes = RecurringPayment & {
  payments?: Payment[];
  account?: Account;
  category?: Category;
};

export class RecurringPaymentDomain {
  id: string;
  description: string;
  paymentMethod: PaymentMethod;
  totalValue?: number;
  automaticPayment: boolean;
  singlePaymentValue: number;
  numberOfInstallments?: number;
  dayOfMonth: number;

  createdAt: Date;
  updatedAt: Date;

  payments?: PaymentDomain[];
  account?: AccountDomain;
  category?: CategoryDomain;

  constructor(props: IProps) {
    this.id = props.id;
    this.description = props.description;
    this.paymentMethod = props.paymentMethod;
    this.totalValue = props.totalValue;
    this.automaticPayment = props.automaticPayment;
    this.singlePaymentValue = props.singlePaymentValue;
    this.numberOfInstallments = props.numberOfInstallments;
    this.dayOfMonth = props.dayOfMonth;

    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.payments = props.payments;
    this.account = props.account;
    this.category = props.category;
  }

  static fromRaw(recurringPaymentRaw: RecurringPaymentWithIncludes) {
    return new RecurringPaymentDomain({
      id: recurringPaymentRaw.id,
      description: recurringPaymentRaw.description,
      paymentMethod:
        (recurringPaymentRaw.paymentMethod as PaymentMethod) || undefined,
      totalValue: recurringPaymentRaw.totalValue || undefined,
      automaticPayment: recurringPaymentRaw.automaticPayment,
      singlePaymentValue: recurringPaymentRaw.singlePaymentValue,
      numberOfInstallments:
        recurringPaymentRaw.numberOfInstallments || undefined,
      dayOfMonth: recurringPaymentRaw.dayOfMonth,
      createdAt: recurringPaymentRaw.createdAt,
      updatedAt: recurringPaymentRaw.updatedAt,

      payments: recurringPaymentRaw.payments?.map((p) =>
        PaymentDomain.fromRaw(p),
      ),
      account: recurringPaymentRaw.account
        ? AccountDomain.fromRaw(recurringPaymentRaw.account)
        : undefined,
      category: recurringPaymentRaw.category
        ? CategoryDomain.fromRaw(recurringPaymentRaw.category)
        : undefined,
    });
  }
  toDTO() {
    return new RecurringPaymentDTO({
      id: this.id,
      description: this.description,
      paymentMethod: this.paymentMethod,
      totalValue: this.totalValue,
      automaticPayment: this.automaticPayment,
      singlePaymentValue: this.singlePaymentValue,
      numberOfInstallments: this.numberOfInstallments,
      dayOfMonth: this.dayOfMonth,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      payments: this.payments?.map((p) => p.toDTO()),
      account: this.account?.toDTO(),
      category: this.category?.toDTO(),
    });
  }
}
