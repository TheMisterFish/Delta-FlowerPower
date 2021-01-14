import { prop, pre, Ref } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, IsLatLong, MinLength } from 'class-validator';
import { User } from "../users/users.model";

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
  @prop({ ref: User })
  made_by: Ref<User>;

  @IsNotEmpty()
  @IsLatLong()
  @prop()
  lat_long_point_one: string;

  @IsNotEmpty()
  @IsLatLong()
  @prop()
  lat_long_point_two: string;

  @IsNotEmpty()
  @IsLatLong()
  @prop()
  lat_long_point_three: string;

  @IsNotEmpty()
  @IsLatLong()
  @prop()
  lat_long_point_four: string;

  @IsDate()
  @prop()
  created_at: Date;

  @IsDate()
  @prop()
  updated_at: Date;
}

