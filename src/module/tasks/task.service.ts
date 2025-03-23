import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Task, TaskStatus } from 'src/entities/Task/task.entity';
import { User } from 'src/entities/user/user.entity';
import { CreateTaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: EntityRepository<Task>,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async create(data: CreateTaskDto, userId: string) {
    try {
      return await this.em.transactional(async (em) => {
        const userRepo = this.userRepository;
        const taskRepo = this.taskRepository;

        const user = await userRepo.findOneOrFail(
          { id: userId },
          { populate: ['tasks'] },
        );

        const task = taskRepo.create({
          user: user,
          ...data,
        });

        user.tasks.add(task);
        await em.flush();

        return {
          message: 'Task created successfully',
          data: task,
        };
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating task');
    }
  }

  async list(userId: string, filter?: TaskStatus | null) {
    try {
      const user = await this.userRepository.findOneOrFail(
        { id: userId },
        { populate: ['tasks'] },
      );
      const tasks = user.tasks.getItems();
      const filteredTasks = filter
        ? tasks.filter((task) => task.status === filter)
        : tasks;
      return {
        message: 'Tasks retrieved successfully',
        data: filteredTasks,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error retrieving tasks');
    }
  }

  async update(id: string, data: Partial<Task>, userId: string) {
    try {
      return await this.em.transactional(async (em) => {
        const userRepo = em.getRepository(User);
        const taskRepo = em.getRepository(Task);
        const user = await userRepo.findOneOrFail({ id: userId });
        const task = await taskRepo.findOneOrFail({ id });
        if (task.user.id !== user.id) {
          throw new BadRequestException('User not authorized to update task');
        }
        Object.assign(task, data);
        await em.flush();
        return {
          message: 'Task updated successfully',
          data: task,
        };
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating task');
    }
  }

  async delete(id: string, userId: string) {
    try {
      return await this.em.transactional(async (em) => {
        const userRepo = em.getRepository(User);
        const taskRepo = em.getRepository(Task);
        const user = await userRepo.findOneOrFail({ id: userId });
        const task = await taskRepo.findOneOrFail({ id });
        if (task.user.id !== user.id) {
          throw new BadRequestException('User not authorized to delete task');
        }
        await taskRepo.nativeDelete(task);
        await em.flush();
        return {
          message: 'Task deleted successfully',
          data: task,
        };
      });
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting task');
    }
  }
}
