import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido' })
    email: string;
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido' })
    password: string;
}

export class RegisterDTO extends LoginDTO {
    @IsString()
    @IsNotEmpty({ message: 'Este campo es requerido' })
    name: string;
}

export interface IToken {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    iat: number;
    exp: number;
}

export interface ITokenExp extends IToken {
    expired: boolean;
}