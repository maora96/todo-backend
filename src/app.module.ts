import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './infra/controllers/task/task.controller';
import { AuthController } from './infra/controllers/auth/auth.controller';
import { TaskService } from './application/services/task/task.service';
import { AuthService } from './application/services/auth/auth.service';

@Module({
  imports: [],
  controllers: [AppController, TaskController, AuthController],
  providers: [AppService, TaskService, AuthService],
})
export class AppModule {}
