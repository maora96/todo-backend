import { v4 as uuid } from 'uuid';
import { User } from './User';

export class Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  readonly user!: User;

  constructor(
    id: string,
    title: string,
    description: string,
    date: Date,
    duration: number,
    createdAt: Date,
  ) {
    this.id = id ?? uuid();
    this.title = title;
    this.description = description;
    this.date = date;
    this.duration = duration;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = new Date();
    this.deletedAt = null;
  }
}
