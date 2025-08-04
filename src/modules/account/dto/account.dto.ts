interface IProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountDTO {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;

  constructor(props: IProps) {
    this.id = props.id;
    this.name = props.name;
    this.createdAt = props.createdAt.toISOString();
    this.updatedAt = props.updatedAt.toISOString();
  }
}
