import { IsString, IsNotEmpty, MinLength, IsMongoId } from 'class-validator';
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
  @IsMongoId()
  location: string;

  made_by: User;

  created_at: Date;
}
