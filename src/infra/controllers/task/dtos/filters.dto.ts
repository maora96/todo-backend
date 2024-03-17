export class FiltersDTO {
  title?: string;
  period: Period;
}

enum Period {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}
