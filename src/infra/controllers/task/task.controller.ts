import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from 'src/application/services/task/task.service';
import { CreateTaskDTO } from './dtos/create-task.dto';
import { EditTaskDTO } from './dtos/edit-task.dto';
import { FiltersDTO } from './dtos/filters.dto';

@Controller('/v1/task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  getMany(@Query() queries: FiltersDTO) {
    return this.taskService.getMany(queries);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const content = await this.taskService.getOne(id);
    return { result: content };
  }

  @Post()
  async create(@Body() body: CreateTaskDTO) {
    const content = await this.taskService.create(body);

    return { result: content };
  }

  @Patch(':id')
  async edit(@Param('id') id: string, @Body() body: EditTaskDTO) {
    const content = await this.taskService.edit(id, body);

    return { result: content };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const content = await this.taskService.delete(id);

    return { result: content };
  }
}
