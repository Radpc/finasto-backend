interface IProps {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export class TagDTO {
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
