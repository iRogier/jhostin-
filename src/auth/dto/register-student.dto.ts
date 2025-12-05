import { IsEmail, IsString, IsNotEmpty, MinLength, IsInt, IsOptional } from 'class-validator';

export class RegisterStudentDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsInt()
    age?: number;

    @IsNotEmpty()
    @IsInt()
    careerId: number;

    @IsNotEmpty()
    @IsInt()
    currentCicle: number;
}
