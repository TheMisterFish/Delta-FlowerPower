import { IsString, IsNotEmpty, IsDate, IsJSON, MinLength } from 'class-validator';

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
  location_id: string;

  @IsString()
  @IsNotEmpty()
  made_by: string;

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
