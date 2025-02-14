import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AppLogger } from 'src/infrastructure/logger/logger';
import { MikroModule } from 'src/lib/mikro-config/mikro.module';
import { JWTService } from 'src/lib/middleware/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MikroModule.forRootAsync(),JwtModule],
  controllers: [TaskController],
  providers: [TaskService,  AppLogger,JWTService],
})
export class TaskModule {}
