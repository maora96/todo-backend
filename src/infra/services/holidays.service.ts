import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { getYear } from 'date-fns';
import { lastValueFrom } from 'rxjs';
import { IHolidaysService } from 'src/domain/services/IHolidaysService';

@Injectable()
export class HolidayService implements IHolidaysService {
  constructor(private readonly httpService: HttpService) {}

  async getBrazilianHolidays() {
    try {
      const thisYear = getYear(new Date());
      const request = await lastValueFrom(
        this.httpService.get(
          `${process.env.HOLIDAY_API_BASE_URL}/${thisYear}/BR`,
        ),
      );
      return request.data;
    } catch (error) {
      console.log(error);
    }
  }
}
