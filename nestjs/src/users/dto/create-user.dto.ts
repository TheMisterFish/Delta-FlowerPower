import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength, IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Roles } from '../../common/interfaces/roles.interface';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    fullname: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Exclude({ toPlainOnly: true })
    password: string;

    @IsNotEmpty()
    @IsEnum(Roles)
    role?: Roles

    created_at: Date;

    updated_at: Date;
}

