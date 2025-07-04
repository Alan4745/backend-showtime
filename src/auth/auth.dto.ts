import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

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

    @IsString()
    method: 'email' | 'google' | 'apple';

    // Profile

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    gender: string;

    @IsNumber()
    @IsOptional()
    age: number;

    @IsString()
    @IsOptional()
    citizenship: string;

    // Physical

    @IsNumber()
    @IsOptional()
    weightKg: number;

    @IsNumber()
    @IsOptional()
    heightCm: number;

    @IsString()
    @IsOptional()
    goal: 'gain_muscle' | 'lose_fat' | 'maintain';

    // Soccer

    @IsString()
    @IsOptional()
    position: 'goalkeeper' | 'defender' | 'center_back' | 'fullback' | 'midfielder' | 'winger' | 'forward';

    @IsString()
    @IsOptional()
    experienceLevel: 'high_school' | 'academy' | 'college' | 'semi_pro' | 'lower_division_pro';

    @IsString()
    @IsOptional()
    trainingFrequency: '3_5_per_week' | '5_7_per_week' | 'more_than_7';

    @IsString()
    @IsOptional()
    dominantFoot: string;

    // Preferences

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    contentLikes: string[];

    @IsBoolean()
    @IsOptional()
    notificationsEnabled: boolean;

    // Meta

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsString()
    @IsOptional()
    lastLogin: string;

    // Plan

    @IsString()
    @IsOptional()
    type: string;

    @IsNumber()
    @IsOptional()
    price: number;
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