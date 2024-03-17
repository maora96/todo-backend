import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO, EditTaskDTO, Filters, Period } from './dtos';
import { Task } from 'src/domain/model/Task/Task';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Between } from 'typeorm';
import {
  format,
  startOfWeek,
  startOfDay,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  endOfDay,
} from 'date-fns';

export const BetweenDates = (period: Period) => {
  const end =
    period === Period.WEEK
      ? endOfWeek(new Date())
      : period === Period.DAY
      ? endOfDay(new Date())
      : endOfMonth(new Date());

  const start =
    period === Period.WEEK
      ? startOfWeek(new Date())
      : period === Period.DAY
      ? startOfDay(new Date())
      : startOfMonth(new Date());
  return Between(start, end);
};

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getMany(filters: Filters): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: {
        ...(filters?.title && { title: filters?.title }),
        ...(filters?.period === Period.WEEK && {
          date: BetweenDates(Period.WEEK),
        }),
        ...(filters?.period === Period.DAY && {
          date: BetweenDates(Period.DAY),
        }),
        ...(filters?.period === Period.MONTH && {
          date: BetweenDates(Period.MONTH),
        }),
      },
    });

    return tasks;
  }

  getOne(id: string): Promise<Task> {
    return this.taskRepository.findOne({ where: { id } });
  }

  create(newTask: CreateTaskDTO): Promise<Task> {
    const { title, description, date, duration } = newTask;
    const task = new Task(title, description, date, duration, new Date());
    return this.taskRepository.save(task);
  }

  async edit(id: string, task: EditTaskDTO): Promise<Task> {
    const existingTask = await this.taskRepository.findOne({
      where: { id },
    });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    existingTask.edit(task);

    return this.taskRepository.save(existingTask);
  }

  async delete(id: string) {
    const task = await this.taskRepository.findOne({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return this.taskRepository.softRemove(task);
  }
}
