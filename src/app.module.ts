import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './infra/controllers/task/task.controller';
import { AuthController } from './infra/controllers/auth/auth.controller';
import { TaskService } from './application/services/task/task.service';
import { AuthService } from './application/services/auth/auth.service';
import { UserSchema } from './infra/database/schemas/User';
import { TaskSchema } from './infra/database/schemas/Task';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { Task } from './domain/model/Task/Task';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [UserSchema, TaskSchema],
      synchronize: true,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST.toString(),
      database: process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT),
    }),
    TerminusModule,
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [AppController, TaskController, AuthController],
  providers: [AppService, TaskService, AuthService],
  exports: [TypeOrmModule],
})
export class AppModule {}
