
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export type UserDocument = User & Document;

@Schema()

export class User {
  @IsString()
  @Prop()
  fullname: { type: string, unique: true, dropDups: true };

  @IsString()
  @IsEmail()
  @Prop()
  email: { type: string, unique: true };

  @IsString()
  @Prop()
  password: string;
  
  @IsString()
  @Prop()
  role: { type:  string, enum: ['admin', 'researcher', 'guest'] }

  @Prop()
  created_at: Date;

  @IsOptional()
  @Prop()
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);