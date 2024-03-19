import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO, EditTaskDTO, Filters, Period, TagsDTO } from './dtos';
import { Task } from 'src/domain/model/Task/Task';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
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
import { Tag } from 'src/domain/model/Tag/Tag';

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

type result = {
  date: string;
  tasks: Task[];
  holidays: Holiday[];
};

export interface QueryResults {
  type: Period;
  result: result[];
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>,
    private holidayService: HolidayService,
  ) {}

  async getMany(
    id: string,
    filters: Filters,
    body: TagsDTO,
  ): Promise<QueryResults> {
    const tasks = await this.taskRepository.find({
      where: {
        ...(filters?.title && { title: ILike(`%${filters?.title}%`) }),
        ...(filters?.period === Period.WEEK && {
          date: BetweenDates(Period.WEEK),
        }),
        ...(filters?.period === Period.DAY && {
          date: BetweenDates(Period.DAY),
        }),
        ...(filters?.period === Period.MONTH && {
          date: BetweenDates(Period.MONTH),
        }),
        ...(body?.tags?.length > 0 && {
          tags: {
            id: In(body.tags),
          },
        }),
        user: {
          id: id,
        },
      },
      relations: {
        tags: true,
      },
    });

    const holidays = await this.holidayService.getBrazilianHolidays();

    let result: result[] = [];

    if (filters.period === Period.DAY) {
      const start = new Date().toISOString().split('T')[0];

      const holiday = holidays.filter((holiday) => holiday.date === start);
      result.push({
        date: start,
        tasks: tasks.filter(
          (task) => task.date.toISOString().split('T')[0] === start,
        ),
        holidays: holiday,
      });
    }

    if (filters.period === Period.MONTH) {
      const datesInAMonth = tasks.map(
        (task) => task.date.toISOString().split('T')[0],
      );
      const uniqueDatesInAMonth = [...new Set(datesInAMonth)];

      uniqueDatesInAMonth.forEach((date) => {
        const holiday = holidays.filter((holiday) => holiday.date === date);
        result.push({
          date,
          tasks: tasks.filter(
            (task) => task.date.toISOString().split('T')[0] === date,
          ),
          holidays: holiday,
        });
      });
    }

    if (filters?.period === Period.WEEK) {
      const datesInAWeek = tasks.map(
        (task) => task.date.toISOString().split('T')[0],
      );
      const uniqueDatesInAWeek = [...new Set(datesInAWeek)];

      uniqueDatesInAWeek.forEach((date) => {
        const holiday = holidays.filter((holiday) => holiday.date === date);
        result.push({
          date,
          tasks: tasks.filter(
            (task) => task.date.toISOString().split('T')[0] === date,
          ),
          holidays: holiday,
        });
      });
    }

    if (!filters.period) {
      const dates = tasks.map((task) => task.date.toISOString().split('T')[0]);
      const uniqueDates = [...new Set(dates)];

      uniqueDates.forEach((date) => {
        const holiday = holidays.filter((holiday) => holiday.date === date);
        result.push({
          date,
          tasks: tasks.filter(
            (task) => task.date.toISOString().split('T')[0] === date,
          ),
          holidays: holiday,
        });
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
    const { title, description, date, duration, tags } = newTask;

    const existingTags = await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });

    const task = new Task(
      title,
      description,
      date,
      duration,
      userId,
      existingTags,
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

    const { tags } = task;

    const existingTags = await this.tagRepository.find({
      where: {
        id: In(tags),
      },
    });

    if (existingTags) {
      existingTask.editTags(existingTags);
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
