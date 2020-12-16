import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Location } from 'src/locations/locations.model';
import { User } from 'src/users/users.model';

export class CreateResearchDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsNotEmpty()
  location: Location;

  made_by: User;

  created_at: Date;

  updated_at: Date;
}
