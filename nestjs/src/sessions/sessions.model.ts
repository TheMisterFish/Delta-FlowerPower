import { prop, pre, Ref } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, MinLength } from 'class-validator';
import { User } from "src/users/users.model";
import { Aimodel } from "src/aimodels/aimodels.model";
import { Research } from "src/researches/researches.model";

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

