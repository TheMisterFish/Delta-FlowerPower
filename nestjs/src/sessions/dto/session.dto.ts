import { IsString } from 'class-validator';

export class SessionsDto {
  @IsString()
  name: string;

  description: string;

  location_id: string;

  made_by: string;

  flower_count: JSON;

  model_id: string;

  created_at: Date;

  updated_at: Date;
}