import { IsString, IsNotEmpty, IsDate, IsLatLong, MinLength } from 'class-validator';

export class LocationsDto {
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
  lat_long_point_one: string;

  @IsNotEmpty()
  @IsLatLong()
  lat_long_point_two: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}