import { IsString, IsNotEmpty, IsEmpty, MinLength } from 'class-validator';

export class CreateAimodelDto { 
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsEmpty() 
  path: string;

  @IsEmpty() 
  made_by: string;

  @IsEmpty() 
  created_at: Date;

  updated_at: Date;
}
