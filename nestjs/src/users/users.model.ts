import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength, IsEnum } from 'class-validator';
import { Roles } from '../common/interfaces/roles.interface';
import { prop, pre } from "@typegoose/typegoose";
import * as bcrypt from 'bcrypt';

@pre<User>('save', function (next) {
  if (this.isModified('password') || this.isNew) {
    bcrypt.hash(this.password, 10, (err, encryptedPass) => {
      if (err) return next(err);
      this.password = encryptedPass;
      return next();
    });
  }
})

export class User {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @prop({ unique: true, required: true, lowercase: true })
  fullname: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @prop({ unique: true, required: true, })
  email: string;

  @IsNotEmpty()
  @IsString()
  @prop({ required: true })
  password: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  @prop({ type: String, enum: Roles })
  role?: Roles

  @prop({ required: true })
  created_at: Date;

  @prop()
  updated_at: Date;
}

