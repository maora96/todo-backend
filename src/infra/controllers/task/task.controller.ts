import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from 'src/application/services/task/task.service';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { EditTaskDTO } from './dtos/edit-task.dto';
import { FiltersDTO } from './dtos/filters.dto';
import { AuthGuard } from '../auth/admin.guard';

@Controller('/v1/task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @Get()
  getMany(@Query() queries: FiltersDTO, @Request() request: any) {
    const userId = request.user.sub;
    return this.taskService.getMany(userId, queries);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    const content = await this.taskService.getOne(id);
    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() body: CreateTaskDTO, @Request() request: any) {
    const userId = request.user.sub;
    const content = await this.taskService.create(body, userId);

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async edit(@Param('id') id: string, @Body() body: EditTaskDTO) {
    const content = await this.taskService.edit(id, body);

    return { result: content };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const content = await this.taskService.delete(id);

    return { result: content };
  }
}
