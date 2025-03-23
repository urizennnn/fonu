import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { User } from 'src/entities/user/user.entity';
import { Task } from 'src/entities/Task/task.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { JWTService } from 'src/utils/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule, MikroOrmModule.forFeature([Task, User])],
  providers: [TaskService, JWTService],
  controllers: [TaskController],
})
export class TaskModule {}
