interface IProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountDTO {
  id: string;
  createdAt: string;
  updatedAt: string;

  constructor(props: IProps) {
    this.id = props.id;
    this.createdAt = props.createdAt.toISOString();
    this.updatedAt = props.updatedAt.toISOString();
  }
}
