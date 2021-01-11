import { prop, pre, Ref } from "@typegoose/typegoose";
import { IsString, IsNotEmpty, IsDate, MinLength, IsNumber } from 'class-validator';
import { User } from "../users/users.model";
import { Aimodel } from "../aimodels/aimodels.model";
import { Research } from "../researches/researches.model";
import { File } from "src/common/models/file/file.model";

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

  @IsNotEmpty()
  @prop({ ref: File })
  weights: Ref<File>;

  @IsDate()
  @prop()
  created_at: Date;

  @IsString()
  @IsNotEmpty()
  @prop()
  session_type: string;

  @IsNumber()
  @IsNotEmpty()
  @prop()
  confidence: Number;

  @IsDate()
  @prop()
  updated_at: Date;
}

