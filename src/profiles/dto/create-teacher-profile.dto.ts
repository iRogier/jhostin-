import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateTeacherProfileDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    specialtyId?: number;
}
