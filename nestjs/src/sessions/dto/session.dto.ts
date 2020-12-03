import { IsString, IsNotEmpty, IsDate, IsJSON, MinLength } from 'class-validator';
import { Location } from '../../locations/locations.model';
import { User } from '../../users/users.model';
import { SessionResult } from '../sessionResult';

export class SessionsDto {
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

  @IsString()
  @IsNotEmpty()
  made_by: User;
  
  results: SessionResult[];

  @IsString()
  @IsNotEmpty()
  model_id: string;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}