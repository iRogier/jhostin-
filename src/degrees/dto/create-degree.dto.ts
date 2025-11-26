import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDegreeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  duration?: string;
}