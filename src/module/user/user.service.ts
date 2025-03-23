import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from 'src/entities/user/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
  ) {}

  async create(data: UserDto) {
    try {
      const user = this.userRepository.create(data);
      await this.em.flush();
      return {
        message: 'User created successfully',
        data: user,
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
