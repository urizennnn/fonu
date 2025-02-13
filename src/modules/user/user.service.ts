import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { EntityManager, MikroORM } from '@mikro-orm/mysql';
import { User } from 'src/infrastructure/database/schemas/user';
import { MICRO_ORM_TOKEN } from 'src/lib/mikro-config/mikro.module';

@Injectable()
export class UserService {
  private readonly em: EntityManager;

  constructor(@Inject(MICRO_ORM_TOKEN) private readonly db: MikroORM) {
    this.em = this.db.em;
  }

  async createUser(user: CreateUserDto) {
    try {
      return await this.em.persistAndFlush(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async getUser(id: string) {
    try {
      return await this.em.find(User, { id });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async updateUser(id: string, userParam: UpdateUserDto) {
    try {
      const user = await this.em.findOne(User, { id });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      user.name = userParam?.name || user.name;
      user.email = userParam?.email || user.email;
      user.password = userParam?.password || user.password;

      return await this.em.persistAndFlush(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.em.findOne(User, { id });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return await this.em.removeAndFlush(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
