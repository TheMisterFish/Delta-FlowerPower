import { IsString, IsNotEmpty, IsEmpty, IsDate, MinLength } from 'class-validator';
import { File } from '../../sessions/file';

export class AimodelDto { 
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  weights: File[]

  @IsString()
  @IsEmpty()
  made_by: string;

  @IsDate()
  @IsEmpty()
  created_at: Date;

  updated_at: Date;
}
