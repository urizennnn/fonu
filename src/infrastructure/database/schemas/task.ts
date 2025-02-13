import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
  TextType,
} from '@mikro-orm/core';
import { User } from './user';

export enum TaskStatus {
  active = 'active',
  completed = 'completed',
}

@Entity()
export class Task {
  @PrimaryKey({ type: 'uuid' })
  id!: number;

  @Property({ type: TextType })
  description!: string;

  @Enum(() => TaskStatus)
  status: TaskStatus = TaskStatus.active;

  @Property({ type: 'date' })
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToOne(() => User)
  user!: User;
}
