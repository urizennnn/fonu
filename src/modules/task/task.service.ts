import { EntityManager, MikroORM } from '@mikro-orm/mysql';
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/task.dto';
import { Task, TaskStatus } from 'src/infrastructure/database/schemas/task';
import { MIKRO_ORM_TOKEN } from 'src/shared/constants';
import { AppLogger } from 'src/infrastructure/logger/logger';
import { User } from 'src/infrastructure/database/schemas/user';

@Injectable()
export class TaskService {
  private readonly em: EntityManager;

  constructor(
    @Inject(MIKRO_ORM_TOKEN) private readonly db: MikroORM,
    private readonly logger: AppLogger,
  ) {
    this.em = this.db.em;
  }

  async createTask(taskDto: CreateTaskDto, userId: string) {
    try {
      const user = await this.em.findOneOrFail(
        User,
        { id: userId },
        { populate: ['tasks'] },
      );
      if (!user) {
        this.logger.warn(`User with id ${userId} not found`);
        throw new BadRequestException('User not found');
      }
      await user.tasks.init();
      const task = new Task(taskDto);
      task.user = user;
      user.tasks.add(task);

      const result = await this.em.persistAndFlush(task);
      this.logger.info(`Task created successfully with id: ${task.id}`);
      return result;
    } catch (error) {
      console.log(error);
      this.logger.error('Failed to create task', {});
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async getTasks(status?: TaskStatus) {
    try {
      if (status) {
        const tasks = await this.em.find(Task, { status });
        this.logger.info(
          `Retrieved ${tasks.length} tasks with status ${status}`,
        );
        return tasks;
      }
      const tasks = await this.em.find(Task, {});
      this.logger.info(`Retrieved ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      this.logger.error('Failed to retrieve tasks', error, {});
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus) {
    try {
      const task = await this.em.findOne(Task, { id });
      if (!task) {
        this.logger.warn(`Task with id ${id} not found`);
        throw new BadRequestException('Task not found');
      }
      task.status = status;
      const result = await this.em.persistAndFlush(task);
      this.logger.info(`Task with id ${id} updated to status ${status}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update task status for id ${id}`, error, {});
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update task status');
    }
  }

  async deleteTask(id: string) {
    try {
      const task = await this.em.findOne(Task, { id });
      if (!task) {
        this.logger.warn(`Task with id ${id} not found`);
        throw new BadRequestException('Task not found');
      }
      const result = await this.em.removeAndFlush(task);
      this.logger.info(`Task with id ${id} deleted successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete task with id ${id}`, error, {});
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
