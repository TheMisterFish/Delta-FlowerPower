import { plainToClass, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsInt,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { SessionResult } from '../../common/models/sessionResult/sessionResult.model';
import { User } from '../../users/users.model';

export class CreateSessionDto {
  name: string;
  
  @IsNotEmpty()
  @IsMongoId()
  research: string;

  @IsNotEmpty()
  @IsMongoId()
  aimodel: string;

  @IsNotEmpty()
  @IsMongoId()
  weights: string;

  @IsNotEmpty()
  @IsString()
  session_type: string;

  @IsNotEmpty()
  @IsNumberString()
  confidence: number;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SessionResult)
  @Transform(results => {
    try {
      return plainToClass(SessionResult, JSON.parse(results));
    } catch (e) {
      return results;
    }
  })
  results: SessionResult[];

  made_by: User;

  created_at: Date;
}
