import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { User } from '../user/user.entity';

export enum TaskStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Entity()
export class Task {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property({ type: 'string' })
  description!: string;

  @Property({
    type: 'enum',
    columnType: 'enum("active", "completed")',
  })
  status!: TaskStatus;

  @Property({ type: 'date' })
  createdAt?: Date = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt?: Date = new Date();

  @ManyToOne(() => User, { inversedBy: 'tasks' })
  user: User;
}
