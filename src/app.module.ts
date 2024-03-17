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
import { JwtModule } from '@nestjs/jwt';
import { HolidayService } from './infra/services/holidays.service';
import { HttpModule } from '@nestjs/axios';
import { TagService } from './application/services/tag/tag.service';
import { TagController } from './infra/controllers/tag/tag.controller';
import { TagSchema } from './infra/database/schemas/Tag';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      entities: [UserSchema, TaskSchema, TagSchema],
      synchronize: true,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST.toString(),
      database: process.env.DB_DATABASE,
      port: Number(process.env.DB_PORT),
    }),
    TerminusModule,
    TypeOrmModule.forFeature([TaskSchema, UserSchema, TagSchema]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    HttpModule,
  ],
  controllers: [AppController, TaskController, AuthController, TagController],
  providers: [AppService, TaskService, AuthService, HolidayService, TagService],
  exports: [TypeOrmModule],
})
export class AppModule {}
