import { IsString } from 'class-validator';

export class UpdatePassword {
    _id: string;
    
    @IsString()
    password: string;

    @IsString()
    new_password: string;

    updated_at: Date;
}