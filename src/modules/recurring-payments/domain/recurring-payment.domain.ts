import {
  Account,
  Category,
  Payment,
  RecurringPayment,
  User,
} from '@prisma/client';
import { AccountDomain } from 'src/modules/account/domain/account.domain';
import { CategoryDomain } from 'src/modules/category/domain/category.domain';
import {
  PaymentDomain,
  PaymentMethod,
} from 'src/modules/payments/domain/payment.domain';
import { RecurringPaymentDTO } from '../dto/recurring-payment.dto';
import { UserDomain } from 'src/modules/user/domain/user.domain';

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

  createdById: string;
  createdBy?: UserDomain;
  payments?: PaymentDomain[];
  accountId: string;
  account?: AccountDomain;
  categoryId: string;
  category?: CategoryDomain;
}

type RecurringPaymentWithIncludes = RecurringPayment & {
  payments?: Payment[];
  account?: Account;
  category?: Category;
  createdBy?: User;
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

  createdById: string;
  createdBy?: UserDomain;
  accountId: string;
  account?: AccountDomain;
  categoryId: string;
  category?: CategoryDomain;
  payments?: PaymentDomain[];

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

    this.createdBy = props.createdBy;
    this.createdById = props.createdById;
    this.payments = props.payments;
    this.account = props.account;
    this.accountId = props.accountId;
    this.category = props.category;
    this.categoryId = props.categoryId;
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

      createdById: recurringPaymentRaw.userId,
      createdBy: recurringPaymentRaw.createdBy
        ? UserDomain.fromRaw(recurringPaymentRaw.createdBy)
        : undefined,
      payments: recurringPaymentRaw.payments?.map((p) =>
        PaymentDomain.fromRaw(p),
      ),
      account: recurringPaymentRaw.account
        ? AccountDomain.fromRaw(recurringPaymentRaw.account)
        : undefined,
      accountId: recurringPaymentRaw.accountId,
      category: recurringPaymentRaw.category
        ? CategoryDomain.fromRaw(recurringPaymentRaw.category)
        : undefined,
      categoryId: recurringPaymentRaw.categoryId,
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
