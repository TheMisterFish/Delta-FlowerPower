import { prop, pre, Ref } from '@typegoose/typegoose';
import { IsString, IsNotEmpty, IsDate, MinLength } from 'class-validator';
import { File } from '../common/models/file/file.model';

@pre<Aimodel>('save', function(next) {
  if (this.isNew) {
    this.created_at = new Date();
  }
  return next();
})
export class Aimodel {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @prop()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @prop()
  description: string;

  @prop({ ref: () => File })
  weights: Ref<File>[];

  @IsString()
  @IsNotEmpty()
  @prop({ ref: 'User' })
  made_by: string;

  @IsDate()
  @prop()
  created_at: Date;
}
