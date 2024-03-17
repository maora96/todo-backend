import { v4 as uuid } from 'uuid';
import { User } from '../User/User';
import { EditTaskDTO } from './dtos';
import { Tag } from '../Tag/Tag';

export class Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  readonly user!: User;
  tags!: Tag[];

  constructor(
    title: string,
    description: string,
    date: Date,
    duration: number,
    userId: string,
    tags: Tag[],
    createdAt: Date,
  ) {
    this.id = uuid();
    this.title = title;
    this.description = description;
    this.date = date;
    this.duration = duration;
    this.userId = userId;
    this.tags = tags;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
  }

  edit(editTaskDTO: EditTaskDTO) {
    this.title = editTaskDTO.title ?? this.title;
    this.description = editTaskDTO.description ?? this.description;
    this.date = editTaskDTO.date ?? this.date;
    this.duration = editTaskDTO.duration ?? this.duration;
  }

  editTags(newTags: Tag[]) {
    this.tags = newTags;
  }
}
