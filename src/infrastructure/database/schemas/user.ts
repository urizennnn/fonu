import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Task } from './task';
import { v4 as uuid } from 'uuid';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', unique: true })
  email!: string;

  @Property({ type: 'text' })
  password!: string;

  @Property({ type: 'date' })
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @OneToMany(() => Task, (task) => task.user)
  tasks = new Collection<Task>(this);

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
