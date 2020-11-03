import { prop } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, IsJSON, MinLength } from 'class-validator';

export class Session {
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
  @prop({ ref: 'Locations' })
  location_id: string;

  @IsString()
  @IsNotEmpty()
  @prop({ ref: 'Users' })
  made_by: string;

  @IsJSON()
  @prop()
  flower_count: JSON;

  @IsString()
  @IsNotEmpty()
  @prop({ ref: 'Models' })
  model_id: string;

  @IsDate()
  @prop()
  created_at: Date;

  @IsDate()
  @prop()
  updated_at: Date;
}

