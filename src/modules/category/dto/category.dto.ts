interface IProps {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export class CategoryDTO {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  constructor(props: IProps) {
    this.id = props.id;
    this.label = props.label;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
