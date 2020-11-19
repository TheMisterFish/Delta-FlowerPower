import { IsString, IsNotEmpty, IsDate, IsJSON, MinLength } from 'class-validator';
import { Location } from 'src/locations/locations.model';

export class UpdateSessionDto {
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
  location_id: Location;

  @IsJSON()
  flower_count: JSON;

  @IsString()
  @IsNotEmpty()
  model_id: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}
