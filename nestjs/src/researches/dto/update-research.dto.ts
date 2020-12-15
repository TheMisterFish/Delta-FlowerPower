import { prop, Ref } from '@typegoose/typegoose';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { Location } from 'src/locations/locations.model';
import { User } from 'src/users/users.model';

export class UpdateResearchDto {
  name: string;

  description: string;

  location: Ref<Location>;

  made_by: Ref<User>;

  created_at: Date;

  updated_at: Date;
}
