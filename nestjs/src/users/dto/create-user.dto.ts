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

    readonly created_at: Date;

    readonly updated_at: Date;
}
