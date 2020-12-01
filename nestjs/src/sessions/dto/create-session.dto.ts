import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateSessionDto { 
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsString()
  @IsNotEmpty()
  location_id: string;

  made_by: string;

  flower_count: JSON;

  @IsString()
  @IsNotEmpty()
  model_id: string;

  created_at: Date;

  updated_at: Date;
}
