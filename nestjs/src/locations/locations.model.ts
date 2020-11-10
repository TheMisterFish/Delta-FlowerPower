import { prop, pre } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, IsLatLong, MinLength } from 'class-validator';

@pre<Location>('save', function (next) {
  if (!this.isNew) {
      this.updated_at = new Date();
  } else {
    this.created_at = new Date();
  }
  return next();
})

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
  lat_long_point_one: string;

  @IsNotEmpty()
  @IsLatLong()
  lat_long_point_two: string;

  @IsDate()
  @prop()
  created_at: Date;

  @IsDate()
  @prop()
  updated_at: Date;
}

