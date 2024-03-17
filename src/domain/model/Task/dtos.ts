import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditTaskDTO {
  @IsString({ message: 'title must be a string.' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'description must be a string.' })
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsNumber()
  @IsOptional()
  duration?: number;
}
