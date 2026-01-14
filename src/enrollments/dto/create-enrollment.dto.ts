import { IsInt, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '@prisma/client-academic';

/**
 * DTO for creating a new enrollment
 */
export class CreateEnrollmentDto {
    @IsInt()
    @IsNotEmpty()
    studentId: number;

    @IsInt()
    @IsNotEmpty()
    subjectId: number;

    @IsString()
    @IsNotEmpty()
    academicPeriod: string;

    @IsEnum(EnrollmentStatus)
    @IsOptional()
    status?: EnrollmentStatus;
}
