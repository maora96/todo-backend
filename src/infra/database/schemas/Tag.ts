import { Tag } from 'src/domain/model/Tag/Tag';
import { Task } from 'src/domain/model/Task/Task';
import { User } from 'src/domain/model/User/User';
import { EntitySchema } from 'typeorm';

export const TagSchema = new EntitySchema<Tag>({
  tableName: 'tags',
  name: Tag.name,
  target: Tag,
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: String,
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
      inverseSide: 'tags',
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
      orphanedRowAction: 'delete',
    },
    tasks: {
      type: 'many-to-many',
      target: Task.name,
      joinColumn: true,
      inverseSide: 'tags',
      joinTable: true,
    },
  },
});
