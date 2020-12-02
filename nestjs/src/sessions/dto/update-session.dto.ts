import { Transform, Type } from 'class-transformer';
import { Location } from '../../locations/locations.model';
import { SessionResult } from '../sessionResult';

export class UpdateSessionDto {
  name: string;

  description: string;

  location_id: Location;

  @Transform(value => JSON.parse(value))
  results: SessionResult[];

  model_id: string;

  created_at: Date;

  updated_at: Date;
}