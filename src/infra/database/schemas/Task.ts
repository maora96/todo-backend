import { Task } from 'src/domain/model/Task/Task';
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
      type: 'timestamp',
    },
    duration: {
      type: Number,
    },
    userId: {
      type: String,
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
      type: 'many-to-one',
      target: User.name,
      joinColumn: true,
      inverseSide: 'tasks',
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
      orphanedRowAction: 'delete',
    },
  },
});
