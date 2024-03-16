import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheckResult } from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/v1/health-check')
  getHealth(): Promise<HealthCheckResult> {
    return this.appService.getHealth();
  }
}
