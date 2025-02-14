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
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/task.dto';
import { TaskStatus } from 'src/infrastructure/database/schemas/task';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.taskService.createTask(createTaskDto);
    return {
      success: true,
      message: 'Task created successfully',
      data: task,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTasks() {
    const tasks = await this.taskService.getTasks();
    return {
      success: true,
      data: tasks,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: TaskStatus,
  ) {
    const updatedTask = await this.taskService.updateTaskStatus(id, status);
    return {
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    await this.taskService.deleteTask(id);
    return {
      success: true,
      message: 'Task deleted successfully',
    };
  }
}
