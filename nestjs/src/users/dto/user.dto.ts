import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength, IsEnum } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Roles } from '../../common/interfaces/roles.interface';

export class UserDto {
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
    @IsEnum(Roles)
    role?: Roles

    @Exclude({ toPlainOnly: true })
    password: string;

    created_at: Date;

    updated_at: Date;

    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial);
    }
}

