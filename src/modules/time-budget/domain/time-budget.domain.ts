import { Category, TimeBudget, User } from '@prisma/client';
import { TimeBudgetDTO } from '../dto/time-budget.dto';
import { UserDomain } from 'src/modules/user/domain/user.domain';
import { CategoryDomain } from 'src/modules/category/domain/category.domain';

interface IProps {
  id: string;
  startDate: Date;
  endDate: Date;
  budgetValue: number;
  createdAt: Date;
  updatedAt: Date;

  createdBy?: UserDomain;
  userId: string;
  category?: CategoryDomain;
  categoryId: string;
}

type TimeBudgetWithIncludes = TimeBudget & {
  category?: Category;
  createdBy?: User;
};

export class TimeBudgetDomain {
  id: string;
  startDate: Date;
  endDate: Date;
  budgetValue: number;
  createdAt: Date;
  updatedAt: Date;

  createdBy?: UserDomain;
  userId: string;
  category?: CategoryDomain;
  categoryId: string;

  constructor(props: IProps) {
    this.id = props.id;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.budgetValue = props.budgetValue;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.createdBy = props.createdBy;
    this.userId = props.userId;
    this.category = props.category;
    this.categoryId = props.categoryId;
  }

  static fromRaw(timeBudgetRaw: TimeBudgetWithIncludes) {
    return new TimeBudgetDomain({
      id: timeBudgetRaw.id,
      startDate: timeBudgetRaw.startDate,
      endDate: timeBudgetRaw.endDate,
      budgetValue: timeBudgetRaw.budgetValue,
      createdAt: timeBudgetRaw.createdAt,
      updatedAt: timeBudgetRaw.updatedAt,
      userId: timeBudgetRaw.userId,
      createdBy: timeBudgetRaw.createdBy
        ? UserDomain.fromRaw(timeBudgetRaw.createdBy)
        : undefined,
      categoryId: timeBudgetRaw.categoryId,
      category: timeBudgetRaw.category
        ? CategoryDomain.fromRaw(timeBudgetRaw.category)
        : undefined,
    });
  }

  toDTO(): TimeBudgetDTO {
    return new TimeBudgetDTO({
      id: this.id,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      budgetValue: this.budgetValue,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      category: this.category?.toDTO(),
      createdBy: this.createdBy?.toDTO(),
    });
  }
}
