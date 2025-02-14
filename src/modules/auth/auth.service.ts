import { EntityManager, MikroORM } from '@mikro-orm/mysql';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/user.dto';
import { AuthUtils } from 'src/shared/utils/utis';
import { User } from 'src/infrastructure/database/schemas/user';
import { LoginDTO } from './dto/auth.dto';
import { JWTService } from 'src/lib/middleware/jwt/jwt.service';
import { MIKRO_ORM_TOKEN } from 'src/shared/constants';
import { AppLogger } from 'src/infrastructure/logger/logger';

@Injectable()
export class AuthService {
  private readonly utils: AuthUtils;
  private readonly em: EntityManager;
  constructor(
    @Inject(MIKRO_ORM_TOKEN) private readonly db: MikroORM,
    private readonly jwtService: JWTService,
    private readonly logger: AppLogger,
  ) {
    this.em = this.db.em;
    this.utils = new AuthUtils();
  }
  async createUser(userDto: CreateUserDto) {
    try {
      userDto.password = await this.utils.generateHash(userDto.password);
      this.logger.info('Password hashed successfully');
      const user = new User(userDto);
      const newuser = await this.em.persistAndFlush(user);
      this.logger.info('User created successfully');
      return newuser;
    } catch (error) {
      console.log(error);
      this.logger.error('User creation failed', {});
      throw new InternalServerErrorException('Failed to create user');
    }
  }
  async login(userparam: LoginDTO) {
    try {
      this.logger.info('Login attempt');
      const user = await this.em.findOne(User, { email: userparam.email });
      if (!user) {
        throw new InternalServerErrorException('User not found');
      }
      const isMatch = await this.utils.comparePassword(
        userparam.password,
        user.password,
      );
      if (!isMatch) {
        throw new InternalServerErrorException('Invalid Credentials');
      }
      const payload = { email: user.email, id: user.id };
      const token = await this.jwtService.sign(payload);
      this.logger.info('Login successful');

      return { token, user };
    } catch (error) {
      this.logger.error('Login failed', {});
      throw new InternalServerErrorException('Failed to login');
    }
  }
}
