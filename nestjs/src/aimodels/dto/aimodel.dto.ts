import { prop, Ref } from '@typegoose/typegoose';
import { IsString, IsNotEmpty, IsEmpty, IsDate, MinLength } from 'class-validator';
import { File } from 'src/common/models/file/file.model';

export class AimodelDto { 
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @prop({ ref: 'File' })
  weights: File[];

  @IsString()
  @IsEmpty()
  made_by: string;

  created_at: Date;

  updated_at: Date;
}
