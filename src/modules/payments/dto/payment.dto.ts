import { CategoryDTO } from 'src/modules/category/dto/category.dto';
import { PaymentMethod, PaymentStatus } from '../domain/payment.domain';
import { TagDTO } from 'src/modules/tags/dto/tag.dto';
import { AccountDTO } from 'src/modules/account/dto/account.dto';
import { RecurringPaymentDTO } from 'src/modules/recurring-payments/dto/recurring-payment.dto';

interface IProps {
  id: string;
  description: string;
  value: number;
  observation?: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;

  account?: AccountDTO;
  category?: CategoryDTO;
  tags?: TagDTO[];
  recurringPayment?: RecurringPaymentDTO;
}

export class PaymentDTO {
  id: string;
  description: string;
  value: number;
  observation?: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;

  account?: AccountDTO;
  category?: CategoryDTO;
  tags?: TagDTO[];
  recurringPayment?: RecurringPaymentDTO;

  constructor(props: IProps) {
    this.id = props.id;
    this.description = props.description;
    this.value = props.value;
    this.observation = props.observation;
    this.status = props.status;
    this.paymentMethod = props.paymentMethod;
    this.paymentDate = props.paymentDate;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.account = props.account;
    this.category = props.category;
    this.tags = props.tags;
    this.recurringPayment = props.recurringPayment;
  }
}
