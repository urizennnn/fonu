import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AppLogger } from 'src/infrastructure/logger/logger';
import { MikroModule } from 'src/lib/mikro-config/mikro.module';

@Module({
  imports: [MikroModule.forRootAsync()],
  controllers: [TaskController],
  providers: [TaskService,  AppLogger],
})
export class TaskModule {}
