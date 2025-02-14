import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/task.dto';
import { TaskStatus } from 'src/infrastructure/database/schemas/task';
import { NeedsAuth } from 'src/common/decorators';
import { UserContext } from '../user/context/user';
import { User } from 'src/infrastructure/database/schemas/user';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @NeedsAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @UserContext() user: Pick<User, 'id' | 'email'>,
  ) {
    console.log(user);
    const task = await this.taskService.createTask(createTaskDto, user.id);
    return {
      success: true,
      message: 'Task created successfully',
      data: task,
    };
  }

  @NeedsAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getTasks(@Query('status') status?: TaskStatus) {
    const tasks = await this.taskService.getTasks(status);
    return { success: true, data: tasks };
  }

  @NeedsAuth()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ) {
    const updatedTask = await this.taskService.updateTaskStatus(id, status);
    return {
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    };
  }

  @NeedsAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTask(@Param('id') id: string) {
    await this.taskService.deleteTask(id);
    return {
      success: true,
      message: 'Task deleted successfully',
    };
  }
}
