import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/user.dto';
import { EntityManager, MikroORM } from '@mikro-orm/mysql';
import { User } from 'src/infrastructure/database/schemas/user';
import { MIKRO_ORM_TOKEN } from 'src/shared/constants';
import { AppLogger } from 'src/infrastructure/logger/logger';

@Injectable()
export class UserService {
  private readonly em: EntityManager;

  constructor(
    @Inject(MIKRO_ORM_TOKEN) private readonly db: MikroORM,
    private readonly logger: AppLogger,
  ) {
    this.em = this.db.em;
  }

  async getUser(id: string) {
    try {
      const user = await this.em.find(User, { id });
      this.logger.info(`Retrieved user(s) with id: ${id}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to retrieve user with id: ${id}`, error, {});
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async updateUser(id: string, userParam: UpdateUserDto) {
    try {
      const user = await this.em.findOne(User, { id });
      if (!user) {
        this.logger.warn(`User with id ${id} not found`);
        throw new BadRequestException('User not found');
      }
      user.name = userParam?.name || user.name;
      user.email = userParam?.email || user.email;
      user.password = userParam?.password || user.password;
      const updatedUser = await this.em.persistAndFlush(user);
      this.logger.info(`User with id ${id} updated successfully`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user with id ${id}`, error, {});
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
        this.logger.warn(`User with id ${id} not found`);
        throw new BadRequestException('User not found');
      }
      const deletedUser = await this.em.removeAndFlush(user);
      this.logger.info(`User with id ${id} deleted successfully`);
      return deletedUser;
    } catch (error) {
      this.logger.error(`Failed to delete user with id ${id}`, error, {});
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
