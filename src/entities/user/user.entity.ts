import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = uuid();

  @Property({ type: 'string' })
  fullName: string;

  @Property({ type: 'string', unique: true })
  email!: string;

  @Property({ type: 'string' })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  task?: Task[];
}
