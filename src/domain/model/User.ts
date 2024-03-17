import { v4 as uuid } from 'uuid';
import { Task } from './Task/Task';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  tasks!: Task[];

  constructor(name: string, email: string, password: string, createdAt: Date) {
    this.id = uuid();
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
  }
}
