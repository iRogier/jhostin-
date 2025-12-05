import { IsEmail, IsString, IsOptional } from 'class-validator';

export class CreateStudentProfileDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    degreeId?: number;

    @IsOptional()
    cycleId?: number;
}
