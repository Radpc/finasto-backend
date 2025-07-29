import { Tag } from '@prisma/client';
import { TagDTO } from '../dto/tag.dto';

interface IProps {
  id: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

type TagWithIncludes = Tag & {};

export class TagDomain {
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

  static fromRaw(tagRaw: TagWithIncludes) {
    return new TagDomain({
      id: tagRaw.id,
      label: tagRaw.label,
      createdAt: tagRaw.createdAt,
      updatedAt: tagRaw.updatedAt,
    });
  }

  toDTO() {
    return new TagDTO({
      id: this.id,
      label: this.label,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    });
  }
}
