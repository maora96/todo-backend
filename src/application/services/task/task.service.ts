import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO, EditTaskDTO, Filters, Period } from './dtos';
import { Task } from 'src/domain/model/Task/Task';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Between } from 'typeorm';
import {
  startOfWeek,
  startOfDay,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  endOfDay,
} from 'date-fns';
import { HolidayService } from 'src/infra/services/holidays.service';
import { Holiday } from 'src/domain/services/IHolidaysService';

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
interface LooseObject {
  [key: string]: {
    tasks: Task[];
    holidays: Holiday[];
  };
}

export interface QueryResults {
  type: Period;
  result: LooseObject;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private holidayService: HolidayService,
  ) {}

  async getMany(id: string, filters: Filters): Promise<QueryResults> {
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
        user: {
          id: id,
        },
      },
    });

    const holidays = await this.holidayService.getBrazilianHolidays();

    let result: LooseObject = {};

    if (filters.period === Period.DAY) {
      const start = startOfDay(new Date()).toISOString().split('T')[0];
      const holiday = holidays.filter((holiday) => holiday.date === start);
      result[`${start}`] = {
        tasks: tasks.filter(
          (task) => task.date.toISOString().split('T')[0] === start,
        ),
        holidays: holiday,
      };
    }

    if (filters.period === Period.MONTH) {
      const datesInAMonth = tasks.map(
        (task) => task.date.toISOString().split('T')[0],
      );
      const uniqueDatesInAMonth = [...new Set(datesInAMonth)];

      uniqueDatesInAMonth.forEach((date) => {
        const holiday = holidays.filter((holiday) => holiday.date === date);
        result[`${date}`] = {
          tasks: tasks.filter(
            (task) => task.date.toISOString().split('T')[0] === date,
          ),
          holidays: holiday,
        };
      });
    }

    if (filters?.period === Period.WEEK) {
      const datesInAWeek = tasks.map(
        (task) => task.date.toISOString().split('T')[0],
      );
      const uniqueDatesInAWeek = [...new Set(datesInAWeek)];

      uniqueDatesInAWeek.forEach((date) => {
        const holiday = holidays.filter((holiday) => holiday.date === date);
        result[`${date}`] = {
          tasks: tasks.filter(
            (task) => task.date.toISOString().split('T')[0] === date,
          ),
          holidays: holiday,
        };
      });
    }

    return {
      type: filters.period,
      result,
    };
  }

  getOne(id: string): Promise<Task> {
    return this.taskRepository.findOne({ where: { id } });
  }

  async create(newTask: CreateTaskDTO, userId: string): Promise<Task> {
    const { title, description, date, duration } = newTask;

    const task = new Task(
      title,
      description,
      date,
      duration,
      userId,
      new Date(),
    );
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
