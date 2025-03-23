import { Request } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/task.dto';
import { NeedsAuth } from 'src/common/decorators';
import { TaskStatus } from 'src/entities/Task/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @NeedsAuth()
  @Post()
  async create(@Body() data: CreateTaskDto, @Req() req: Request) {
    const user = req.user.id;
    return this.taskService.create(data, user);
  }

  @NeedsAuth()
  @Get('list/:filter')
  async list(@Req() req: Request, @Param() filter: TaskStatus) {
    const user = req.user.id;
    return this.taskService.list(user, filter);
  }

  @NeedsAuth()
  @Delete('delete/:id')
  async delete(@Param() id: string, @Req() req: Request) {
    const user = req.user.id;
    return this.taskService.delete(id, user);
  }

  @NeedsAuth()
  @Patch(':id')
  async update(
    @Param() id: string,
    @Body() data: { description: string; status: TaskStatus },
    @Req() req: Request,
  ) {
    const user = req.user.id;
    return this.taskService.update(id, data, user);
  }
}
