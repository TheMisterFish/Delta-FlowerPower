import { prop, pre } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, MinLength } from 'class-validator';

@pre<Aimodel>('save', function (next) {
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

  @IsString()
  @IsNotEmpty()
  @prop()
  path: string;

  @IsString()
  @IsNotEmpty()
  @prop({ ref: 'User' })
  made_by: string;

  @IsDate()
  @prop()
  created_at: Date;
}

