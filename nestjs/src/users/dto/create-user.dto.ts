import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    readonly fullname: string;

    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly role: { type:  string, enum: ['admin', 'researcher', 'guest'] };

    @IsNotEmpty()
    readonly created_at: Date;

    @IsNotEmpty()
    readonly updated_at: Date;
}
