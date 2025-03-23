import {
  BeforeCreate,
  BeforeUpdate,
  Collection,
  Entity,
  EventArgs,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { Task } from '../Task/task.entity';
import { hash, verify } from 'argon2';

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
  tasks = new Collection<Task>(this);

  constructor(fullName: string, email: string, password: string) {
    this.fullName = fullName;
    this.email = email;
    this.password = password;
  }
  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(args: EventArgs<User>) {
    const password = args.changeSet?.payload.password;
    if (password) {
      this.password = await hash(password);
    }
  }
  async verifyPassword(password: string) {
    return verify(this.password, password);
  }
}
