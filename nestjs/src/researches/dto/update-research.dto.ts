import { IsOptional, IsString, MinLength } from 'class-validator';
import { Location } from 'src/locations/locations.model';
import { User } from 'src/users/users.model';

export class UpdateResearchDto {
  @IsString()
  @IsOptional()
  @MinLength(5)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  description: string;

  location: Location;

  updated_at: Date;
}
