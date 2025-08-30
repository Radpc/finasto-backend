import { CategoryDTO } from 'src/modules/category/dto/category.dto';
import { UserDTO } from 'src/modules/user/dto/user.dto';

interface IProps {
  id: string;
  startDate: string;
  endDate: string;
  budgetValue: number;
  createdAt: string;
  updatedAt: string;

  createdBy?: UserDTO;
  category?: CategoryDTO;
}

export class TimeBudgetDTO {
  id: string;
  startDate: string;
  endDate: string;
  budgetValue: number;
  createdAt: string;
  updatedAt: string;

  createdBy?: UserDTO;
  category?: CategoryDTO;

  constructor(props: IProps) {
    this.id = props.id;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.budgetValue = props.budgetValue;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;

    this.createdBy = props.createdBy;
    this.category = props.category;
  }
}
