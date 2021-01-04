import { prop, pre, Ref } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, MinLength } from 'class-validator';
import { Session } from "../sessions/sessions.model";
import { Location } from "../locations/locations.model";
import { User } from "../users/users.model";

@pre<Research>('save', function (next) {
  if (!this.isNew) {
      this.updated_at = new Date();
  } else {
    this.created_at = new Date();
  }
  return next();
})

export class Research {
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

  @IsNotEmpty()
  @prop({ ref: Location })
  location: Ref<Location>;

  @prop({ ref: () => Session })
  sessions: Ref<Session>[];

  @IsNotEmpty()
  @prop({ ref: User })
  made_by: Ref<User>;

  @IsDate()
  @prop()
  created_at: Date;

  @IsDate()
  @prop()
  updated_at: Date;
}

