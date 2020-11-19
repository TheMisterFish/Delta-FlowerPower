import { prop, pre, Ref } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, IsJSON, MinLength } from 'class-validator';
import { Location } from "src/locations/locations.model";
import { User } from "src/users/users.model";

@pre<Session>('save', function (next) {
  if (!this.isNew) {
      this.updated_at = new Date();
  } else {
    this.created_at = new Date();
  }
  return next();
})

export class Session {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @prop()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @prop()
  description: string;

  @IsString()
  @IsNotEmpty()
  @prop({ ref: 'Location' })
  location_id: Ref<Location>;

  @IsString()
  @IsNotEmpty()
  @prop({ ref: 'User' })
  made_by: Ref<User>;

  @IsJSON()
  @prop()
  flower_count: JSON;

  @IsString()
  @IsNotEmpty()
  @prop({ ref: 'AIModel' })
  model_id: string;

  @IsDate()
  @prop()
  created_at: Date;

  @IsDate()
  @prop()
  updated_at: Date;
}

