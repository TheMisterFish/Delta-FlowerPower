import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength, IsEnum } from 'class-validator';
import { Roles } from '../../interfaces/roles.interface';
import { prop } from "@typegoose/typegoose";

export class CreateUserDto {
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

    @prop()
    created_at: Date;

    @prop()
    updated_at: Date;
}

