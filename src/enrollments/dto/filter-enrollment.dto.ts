import { IsInt, IsString, IsEnum, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '@prisma/client-academic';
import { Type } from 'class-transformer';

/**
 * DTO for filtering enrollments
 */
export class FilterEnrollmentDto {
    @IsInt()
    @IsOptional()
    @Type(() => Number)
    studentId?: number;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    subjectId?: number;

    @IsString()
    @IsOptional()
    academicPeriod?: string;

    @IsEnum(EnrollmentStatus)
    @IsOptional()
    status?: EnrollmentStatus;
}
