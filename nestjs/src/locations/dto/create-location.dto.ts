import { IsString, IsNotEmpty, IsLatLong, MinLength } from 'class-validator';
import { User } from 'src/users/users.model';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  made_by: User;

  @IsNotEmpty()
  @IsLatLong()
  lat_long_point_one: string;

  @IsNotEmpty()
  @IsLatLong()
  lat_long_point_two: string;

  @IsNotEmpty()
  @IsLatLong()
  lat_long_point_three: string;

  @IsNotEmpty()
  @IsLatLong()
  lat_long_point_four: string;

  created_at: Date;
}