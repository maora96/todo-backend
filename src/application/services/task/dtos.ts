export class CreateTaskDTO {
  title: string;
  description: string;
  date: Date;
  duration: number;
  tags: string[];
}

export class EditTaskDTO {
  title?: string;
  description?: string;
  date?: Date;
  duration?: number;
  tags?: string[];
}

export class Filters {
  title?: string;
  period?: Period;
}

export class TagsDTO {
  tags: string[];
}

export enum Period {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}
