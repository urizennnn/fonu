import { EntityManager, MikroORM } from '@mikro-orm/mysql';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/task.dto';
import { Task, TaskStatus } from 'src/infrastructure/database/schemas/task';
import { MICRO_ORM_TOKEN } from 'src/lib/mikro-config/mikro.module';

@Injectable()
export class TaskService {
  private readonly em: EntityManager;

  constructor(@Inject(MICRO_ORM_TOKEN) private readonly db: MikroORM) {
    this.em = this.db.em;
  }

  async createTask(task: CreateTaskDto) {
    try {
      return await this.em.persistAndFlush(task);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async getTasks() {
    try {
      return await this.em.find(Task, {});
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus) {
    try {
      const task = await this.em.findOne(Task, { id });
      if (!task) {
        throw new BadRequestException('Task not found');
      }
      task.status = status;
      return await this.em.persistAndFlush(task);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update task status');
    }
  }

  async deleteTask(id: number) {
    try {
      const task = await this.em.findOne(Task, { id });
      if (!task) {
        throw new BadRequestException('Task not found');
      }
      return await this.em.removeAndFlush(task);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
