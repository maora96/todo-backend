import { Task } from 'src/domain/model/Task';
import { User } from 'src/domain/model/User';
import { EntitySchema } from 'typeorm';

export const UserSchema = new EntitySchema<User>({
  tableName: 'users',
  name: User.name,
  target: User,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
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
    tasks: {
      type: 'many-to-one',
      target: Task.name,
      joinColumn: true,
      inverseSide: 'users',
    },
  },
});
