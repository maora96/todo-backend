import { v4 as uuid } from 'uuid';
import { User } from '../User/User';
import { EditTagDTO } from './dtos';
import { Task } from '../Task/Task';

export class Tag {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  readonly user!: User;
  tasks!: Task[];

  constructor(name: string, userId: string, createdAt: Date) {
    this.id = uuid();
    this.name = name;
    this.userId = userId;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
  }

  edit(editTagDTO: EditTagDTO) {
    this.name = editTagDTO.name ?? this.name;
  }
}
