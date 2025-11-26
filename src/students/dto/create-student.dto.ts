import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsInt()
  degreeId?: number;

  @IsOptional()
  @IsInt()
  cycleId?: number;

  @IsOptional()
  @IsString()
  password?: string;
}