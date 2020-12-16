import { IsString, IsNotEmpty, IsEmpty, MinLength } from 'class-validator';
import { File } from 'src/common/models/file/file.model';

export class CreateAimodelDto { 
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  weights: File[]

  @IsEmpty() 
  made_by: string;

  @IsEmpty() 
  created_at: Date;

  updated_at: Date;
}
