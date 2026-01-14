import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaAcademicService } from '../prisma/prisma-academic.service';

/**
 * Interface for enrollment statistics report
 */
export interface EnrollmentStatistics {
    studentName: string;
    degreeName: string;
    totalSubjects: number;
}

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaAcademicService) { }

    /**
     * PART 3 - NATIVE SQL QUERY:
     * Get enrollment statistics report using native SQL
     * 
     * Returns: Student name, degree name, and total subjects enrolled
     * Ordered by total subjects descending
     * 
     * @returns Enrollment statistics for all students
     */
    async getEnrollmentStatistics(): Promise<EnrollmentStatistics[]> {
        try {
            // Native SQL query using Prisma $queryRaw
            const results = await this.prisma.$queryRaw<EnrollmentStatistics[]>`
        SELECT 
          CONCAT(s.first_name, ' ', s.last_name) as "studentName",
          d.name as "degreeName",
          COUNT(e.enrollment_id)::int as "totalSubjects"
        FROM students s
        LEFT JOIN degrees d ON s.degree_id = d.degree_id
        LEFT JOIN enrollments e ON s.student_id = e.student_id
        WHERE s.is_active = true
        GROUP BY s.student_id, s.first_name, s.last_name, d.name
        HAVING COUNT(e.enrollment_id) > 0
        ORDER BY "totalSubjects" DESC
      `;

            return results;
        } catch (error) {
            console.error('Error generating enrollment statistics:', error);
            throw new InternalServerErrorException(
                'Error generating enrollment statistics',
            );
        }
    }

    /**
     * Get enrollment statistics for a specific degree
     * 
     * @param degreeId - Degree ID
     * @returns Enrollment statistics for students in the degree
     */
    async getEnrollmentStatisticsByDegree(
        degreeId: number,
    ): Promise<EnrollmentStatistics[]> {
        try {
            const results = await this.prisma.$queryRaw<EnrollmentStatistics[]>`
        SELECT 
          CONCAT(s.first_name, ' ', s.last_name) as "studentName",
          d.name as "degreeName",
          COUNT(e.enrollment_id)::int as "totalSubjects"
        FROM students s
        INNER JOIN degrees d ON s.degree_id = d.degree_id
        LEFT JOIN enrollments e ON s.student_id = e.student_id
        WHERE s.is_active = true AND s.degree_id = ${degreeId}
        GROUP BY s.student_id, s.first_name, s.last_name, d.name
        HAVING COUNT(e.enrollment_id) > 0
        ORDER BY "totalSubjects" DESC
      `;

            return results;
        } catch (error) {
            console.error('Error generating enrollment statistics by degree:', error);
            throw new InternalServerErrorException(
                'Error generating enrollment statistics by degree',
            );
        }
    }

    /**
     * Get enrollment statistics for a specific academic period
     * 
     * @param academicPeriod - Academic period (e.g., "2024-1")
     * @returns Enrollment statistics for the period
     */
    async getEnrollmentStatisticsByPeriod(
        academicPeriod: string,
    ): Promise<EnrollmentStatistics[]> {
        try {
            const results = await this.prisma.$queryRaw<EnrollmentStatistics[]>`
        SELECT 
          CONCAT(s.first_name, ' ', s.last_name) as "studentName",
          d.name as "degreeName",
          COUNT(e.enrollment_id)::int as "totalSubjects"
        FROM students s
        LEFT JOIN degrees d ON s.degree_id = d.degree_id
        INNER JOIN enrollments e ON s.student_id = e.student_id
        WHERE e.academic_period = ${academicPeriod}
        GROUP BY s.student_id, s.first_name, s.last_name, d.name
        ORDER BY "totalSubjects" DESC
      `;

            return results;
        } catch (error) {
            console.error(
                'Error generating enrollment statistics by period:',
                error,
            );
            throw new InternalServerErrorException(
                'Error generating enrollment statistics by period',
            );
        }
    }
}
