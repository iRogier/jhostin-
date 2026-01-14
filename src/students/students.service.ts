import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaAcademicService } from '../prisma/prisma-academic.service';
import { FilterStudentDto } from './dto/filter-student.dto';
import { Student, Enrollment } from '@prisma/client-academic';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaAcademicService) { }

  /**
   * Find all students (basic query)
   * 
   * @returns List of all students
   */
  async findAll(): Promise<Student[]> {
    try {
      return await this.prisma.student.findMany({
        include: {
          degree: true,
          cycle: true,
        },
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new InternalServerErrorException('Error fetching students');
    }
  }

  /**
   * PART 1 - DERIVED QUERY:
   * List all active students with their degree information
   * 
   * @returns Active students with degree details
   */
  async findActiveStudentsWithDegree(): Promise<Student[]> {
    try {
      return await this.prisma.student.findMany({
        where: {
          isActive: true,
        },
        include: {
          degree: true,
          cycle: true,
        },
        orderBy: {
          lastName: 'asc',
        },
      });
    } catch (error) {
      console.error('Error fetching active students:', error);
      throw new InternalServerErrorException(
        'Error fetching active students',
      );
    }
  }

  /**
   * PART 2 - LOGICAL OPERATIONS:
   * Search students with complex logical conditions:
   * - isActive AND
   * - degreeId AND
   * - has enrollments in academicPeriod
   * 
   * @param filter - Complex filter criteria
   * @returns Students matching all criteria
   */
  async findByComplexFilter(filter: FilterStudentDto): Promise<Student[]> {
    try {
      const where: any = {};

      // Logical AND conditions
      if (filter.isActive !== undefined) {
        where.isActive = filter.isActive;
      }

      if (filter.degreeId) {
        where.degreeId = filter.degreeId;
      }

      if (filter.cycleId) {
        where.cycleId = filter.cycleId;
      }

      // If academic period is specified, add enrollment filter
      if (filter.academicPeriod) {
        where.enrollments = {
          some: {
            academicPeriod: filter.academicPeriod,
          },
        };
      }

      return await this.prisma.student.findMany({
        where,
        include: {
          degree: true,
          cycle: true,
          enrollments: filter.academicPeriod
            ? {
              where: {
                academicPeriod: filter.academicPeriod,
              },
              include: {
                subject: true,
              },
            }
            : false,
        },
        orderBy: {
          lastName: 'asc',
        },
      });
    } catch (error) {
      console.error('Error filtering students:', error);
      throw new InternalServerErrorException('Error filtering students');
    }
  }

  /**
   * PART 1 - DERIVED QUERY:
   * Get enrollments for a student in a specific academic period
   * 
   * @param studentId - Student ID
   * @param academicPeriod - Academic period (e.g., "2024-1")
   * @returns Student enrollments for the period
   */
  async findEnrollmentsByPeriod(
    studentId: number,
    academicPeriod: string,
  ): Promise<Enrollment[]> {
    try {
      // First verify student exists
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }

      return await this.prisma.enrollment.findMany({
        where: {
          studentId,
          academicPeriod,
        },
        include: {
          subject: {
            include: {
              teacher: true,
              degree: true,
            },
          },
        },
        orderBy: {
          enrollmentDate: 'desc',
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching student enrollments:', error);
      throw new InternalServerErrorException(
        'Error fetching student enrollments',
      );
    }
  }

  /**
   * Find a single student by ID
   * 
   * @param id - Student ID
   * @returns Student with relations
   * @throws NotFoundException if student not found
   */
  async findOne(id: number): Promise<Student> {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id },
        include: {
          degree: true,
          cycle: true,
          enrollments: {
            include: {
              subject: {
                include: {
                  teacher: true,
                },
              },
            },
          },
        },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching student:', error);
      throw new InternalServerErrorException('Error fetching student');
    }
  }

  /**
   * Update a student
   * 
   * @param id - Student ID
   * @param dto - Update data
   * @returns Updated student
   */
  async update(id: number, dto: any): Promise<Student> {
    try {
      return await this.prisma.student.update({
        where: { id },
        data: dto,
        include: {
          degree: true,
          cycle: true,
        },
      });
    } catch (error) {
      console.error('Error updating student:', error);
      throw new InternalServerErrorException('Error updating student');
    }
  }

  /**
   * Delete a student
   * 
   * @param id - Student ID
   * @returns Deleted student
   */
  async remove(id: number): Promise<Student> {
    try {
      return await this.prisma.student.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      throw new InternalServerErrorException('Error deleting student');
    }
  }
}
