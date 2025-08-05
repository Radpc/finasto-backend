import { CategoryDTO } from 'src/modules/category/dto/category.dto';
import { AccountDTO } from 'src/modules/account/dto/account.dto';
import { PaymentMethod } from 'src/modules/payments/domain/payment.domain';
import { PaymentDTO } from 'src/modules/payments/dto/payment.dto';

interface IProps {
  id: string;
  description: string;
  paymentMethod: PaymentMethod;
  totalValue?: number;
  automaticPayment: boolean;
  singlePaymentValue: number;
  numberOfInstallments?: number;
  dayOfMonth: number;

  createdAt: string;
  updatedAt: string;

  payments?: PaymentDTO[];
  account?: AccountDTO;
  category?: CategoryDTO;
}

export class RecurringPaymentDTO {
  id: string;
  description: string;
  paymentMethod: PaymentMethod;
  totalValue?: number;
  automaticPayment: boolean;
  singlePaymentValue: number;
  numberOfInstallments?: number;
  dayOfMonth: number;
  createdAt: string;
  updatedAt: string;

  payments?: PaymentDTO[];
  account?: AccountDTO;
  category?: CategoryDTO;

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
}
