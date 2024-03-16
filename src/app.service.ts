import { Injectable } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class AppService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}
  getHealth(): Promise<HealthCheckResult> {
    return this.health.check([
      (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck('database', { timeout: 30000 }),
    ]);
  }
}
