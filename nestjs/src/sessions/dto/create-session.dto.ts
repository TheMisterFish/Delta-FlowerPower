import { plainToClass, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsMongoId,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { SessionResult } from 'src/common/models/sessionResult/sessionResult.model';
import { User } from 'src/users/users.model';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsNotEmpty()
  @IsMongoId()
  research: string;

  @IsNotEmpty()
  @IsMongoId()
  aimodel: string;

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
