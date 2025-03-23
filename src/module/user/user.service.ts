import { EntityManager, EntityRepository } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from 'src/entities/user/user.entity';
import { LoginDto, UserDto } from './dto/user.dto';
import { JWTService } from 'src/utils/jwt/jwt.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager,
    private readonly jwtService: JWTService,
  ) {}

  async create(data: UserDto) {
    try {
      const user = this.userRepository.create(data);
      await this.em.flush();
      const userpayload = {
        email: user.email,
        id: user.id,
      };
      const { accessToken, refreshToken } =
        this.jwtService.returnTokens(userpayload);
      return {
        message: 'User created successfully',
        data: {
          user,
          tokens: {
            accessToken,
            refreshToken,
          },
        },
      };
    } catch (e) {
      this.logger.error(e);
      await this.userRepository.nativeDelete(data);
      await this.em.flush();
      throw new InternalServerErrorException('Error creating user');
    }
  }
  async login(data: LoginDto) {
    try {
      const user = await this.userRepository.findOneOrFail({
        email: data.email,
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (await user.verifyPassword(data.password)) {
        const userpayload = {
          email: user.email,
          id: user.id,
        };
        const { accessToken, refreshToken } =
          this.jwtService.returnTokens(userpayload);
        return {
          message: 'User logged in successfully',
          data: {
            user,
            tokens: {
              accessToken,
              refreshToken,
            },
          },
        };
      }
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Error logging in user');
    }
  }
}
