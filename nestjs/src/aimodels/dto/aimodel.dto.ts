import { IsString, IsNotEmpty, IsEmpty, IsDate, MinLength } from 'class-validator';

export class AimodelDto { 
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsString()
  @IsEmpty()
  path: string;

  @IsString()
  @IsEmpty()
  made_by: string;

  @IsDate()
  @IsEmpty()
  created_at: Date;
}
