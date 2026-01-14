import { IsInt, IsBoolean, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for filtering students with complex logical operations
 */
export class FilterStudentDto {
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isActive?: boolean;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    degreeId?: number;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    cycleId?: number;

    @IsString()
    @IsOptional()
    academicPeriod?: string;
}
