import { prop } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, IsLatLong, MinLength } from 'class-validator';

export class Location {
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
  @prop({ ref: 'Users' })
  made_by: string;

  @IsNotEmpty()
  @IsLatLong()
  @prop()
  longitude_point_one: number;

  @IsNotEmpty()
  @IsLatLong()
  @prop()
  latitude_point_one: number;

  @IsNotEmpty()
  @IsLatLong()
  @prop()
  longitude_point_two: number;

  @IsNotEmpty()
  @IsLatLong()
  @prop()
  latitude_point_two: number;

  @IsDate()
  @prop()
  created_at: Date;

  @IsDate()
  @prop()
  updated_at: Date;
}

