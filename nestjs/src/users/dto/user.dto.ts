import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength, IsEnum } from 'class-validator';
import { Roles } from '../../interfaces/roles.interface';

export class UserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    readonly fullname: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;

    @IsNotEmpty()
    @IsEnum(Roles)
    readonly role?: Roles

    readonly created_at: Date;

    readonly updated_at: Date;
}

