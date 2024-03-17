import { IsOptional, IsString } from 'class-validator';

export class EditTagDTO {
  @IsString({ message: 'name must be a string.' })
  @IsOptional()
  name?: string;
}
