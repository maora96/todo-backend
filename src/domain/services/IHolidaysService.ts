export interface IHolidaysService {
  getBrazilianHolidays(): Promise<Holiday[]>;
}

export type Holiday = {
  date: Date;
  localName: string;
  name: string;
  countryCode: string;
  fixed: boolean;
  global: boolean;
  counties: string[] | null;
  launchYear: Date | null;
  types: string[];
};
