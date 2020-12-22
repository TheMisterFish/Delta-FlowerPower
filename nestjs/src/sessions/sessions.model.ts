import { prop, pre, Ref } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, MinLength, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Location } from "../locations/locations.model";
import { User } from "src/users/users.model";
import { SessionResult } from "./sessionResult";
import { Aimodel } from "src/aimodels/aimodels.model";
import { Research } from "src/researches/researches.model";
import { plainToClass, Transform, Type } from "class-transformer";

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
  @prop({ ref: User })
  made_by: Ref<User>;

  @IsNotEmpty()
  @prop({Ref: Research})
  research: Ref<Research>
  
  @prop()
  results: any;

  @IsString()
  @IsNotEmpty()
  @prop({ ref: Aimodel })
  aimodel: Ref<Aimodel>;

  @IsDate()
  @prop()
  created_at: Date;

  @IsDate()
  @prop()
  updated_at: Date;
}

