import { IsString, IsNotEmpty, IsDate, IsLatLong, MinLength, IsOptional } from 'class-validator';

export class UpdateLocationDto {  
  @IsString()
  @IsOptional()
  @MinLength(5)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsLatLong()
  lat_long_point_one: string;

  @IsOptional()
  @IsLatLong()
  lat_long_point_two: string;

  @IsOptional()
  @IsLatLong()
  lat_long_point_three: string;

  @IsOptional()
  @IsLatLong()
  lat_long_point_four: string;

  updated_at: Date;
}