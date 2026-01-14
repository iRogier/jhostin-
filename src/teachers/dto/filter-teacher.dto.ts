import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EmploymentType } from '@prisma/client-academic';

/**
 * DTO for filtering teachers with logical operations
 */
export class FilterTeacherDto {
    @IsEnum(EmploymentType)
    @IsOptional()
    employmentType?: EmploymentType;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    hasSubjects?: boolean;
}
