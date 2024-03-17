export class CreateTaskDTO {
  title: string;
  description: string;
  date: Date;
  duration: number;
}

export class EditTaskDTO {
  title?: string;
  description?: string;
  date?: Date;
  duration?: number;
}

export class Filters {
  title?: string;
  period?: Period;
}

export enum Period {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}
