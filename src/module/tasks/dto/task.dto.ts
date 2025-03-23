import { IsEnum } from '@nestjs/class-validator';
import { IsString } from 'class-validator';
import { TaskStatus } from 'src/entities/Task/task.entity';

export class CreateTaskDto {
  @IsString()
  description: string;

  @IsEnum(TaskStatus, {
    message: 'Invalid status',
  })
  status: TaskStatus;
}
