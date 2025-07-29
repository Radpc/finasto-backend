import { Category } from '@prisma/client';
import { CategoryDTO } from '../dto/category.dto';

interface IProps {
  id: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryDomain {
  id: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: IProps) {
    this.id = props.id;
    this.label = props.label;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static fromRaw(category: Category) {
    return new CategoryDomain({
      id: category.id,
      label: category.label,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }

  toDTO() {
    return new CategoryDTO({
      id: this.id,
      label: this.label,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    });
  }
}
