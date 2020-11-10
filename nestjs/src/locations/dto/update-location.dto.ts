import { IsString, IsNotEmpty, IsDate, IsLatLong, MinLength } from 'class-validator';

export class UpdateLocationDto {
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
  made_by: string;

  @IsNotEmpty()
  @IsLatLong()
  longitude_point_one: number;

  @IsNotEmpty()
  @IsLatLong()
  latitude_point_one: number;

  @IsNotEmpty()
  @IsLatLong()
  longitude_point_two: number;

  @IsNotEmpty()
  @IsLatLong()
  latitude_point_two: number;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}