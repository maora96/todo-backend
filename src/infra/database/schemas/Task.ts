import { Task } from 'src/domain/model/Task';
import { User } from 'src/domain/model/User';
import { EntitySchema } from 'typeorm';

export const TaskSchema = new EntitySchema<Task>({
  tableName: 'tasks',
  name: Task.name,
  target: Task,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    date: {
      type: 'date',
    },
    duration: {
      type: Number,
    },
    createdAt: {
      type: 'timestamp',
      createDate: true,
    },
    updatedAt: {
      type: 'timestamp',
      updateDate: true,
    },
    deletedAt: {
      type: 'timestamp',
      deleteDate: true,
    },
  },
  relations: {
    user: {
      type: 'one-to-many',
      target: User.name,
    },
  },
});
