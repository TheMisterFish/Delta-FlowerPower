import { IsString, IsNotEmpty, IsDate, IsLatLong, MinLength, IsDateString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  made_by: string;

  @IsNotEmpty()
  @IsLatLong()
  lat_long_point_one: string;

  @IsNotEmpty()
  @IsLatLong()
  lat_long_point_two: string;

  created_at: Date;

  updated_at: Date;
}