import { IsString, IsOptional, MaxLength, MinLength, IsEnum } from 'class-validator';
import { Roles } from '../../common/interfaces/roles.interface';

export class UpdateUserDto {
    _id: string;
    
    @IsOptional()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsOptional()
    @IsEnum(Roles)
    role?: Roles;

    updated_at: Date;
}