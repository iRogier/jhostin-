import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaAcademicService } from '../prisma/prisma-academic.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FilterTeacherDto } from './dto/filter-teacher.dto';
import { Teacher } from '@prisma/client-academic';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaAcademicService) { }

  /**
   * Find all teachers with pagination
   * 
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of teachers
   */
  async findAll(page = 1, limit = 10): Promise<Teacher[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.prisma.teacher.findMany({
        skip,
        take: limit,
        include: {
          specialty: true,
          subjects: true,
        },
      });
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw new InternalServerErrorException('Error fetching teachers');
    }
  }

  /**
   * PART 1 - DERIVED QUERY:
   * Find teachers teaching more than one subject
   * 
   * @returns Teachers with multiple subject assignments
   */
  async findTeachingMultipleSubjects(): Promise<Teacher[]> {
    try {
      const teachers = await this.prisma.teacher.findMany({
        include: {
          specialty: true,
          subjects: {
            include: {
              degree: true,
              cycle: true,
            },
          },
        },
      });

      // Filter teachers with more than one subject
      return teachers.filter((teacher) => teacher.subjects.length > 1);
    } catch (error) {
      console.error('Error fetching teachers with multiple subjects:', error);
      throw new InternalServerErrorException(
        'Error fetching teachers with multiple subjects',
      );
    }
  }

  /**
   * PART 2 - LOGICAL OPERATIONS:
   * Filter teachers using logical operators:
   * - employmentType (FULL_TIME, PART_TIME, CONTRACT)
   * - isActive (AND condition)
   * - hasSubjects (OR condition - has at least one subject assigned)
   * 
   * Example: Find FULL_TIME teachers who ARE active AND have subjects
   * 
   * @param filter - Complex filter criteria
   * @returns Teachers matching the logical conditions
   */
  async findByLogicalFilter(filter: FilterTeacherDto): Promise<Teacher[]> {
    try {
      const where: any = {};

      // Logical AND: employment type
      if (filter.employmentType) {
        where.employmentType = filter.employmentType;
      }

      // Logical AND: active status (NOT inactive)
      if (filter.isActive !== undefined) {
        where.isActive = filter.isActive;
      }

      // Logical OR: has subjects or not
      if (filter.hasSubjects !== undefined) {
        if (filter.hasSubjects) {
          where.subjects = {
            some: {}, // At least one subject
          };
        } else {
          where.subjects = {
            none: {}, // No subjects assigned
          };
        }
      }

      return await this.prisma.teacher.findMany({
        where,
        include: {
          specialty: true,
          subjects: {
            include: {
              degree: true,
            },
          },
        },
        orderBy: {
          lastName: 'asc',
        },
      });
    } catch (error) {
      console.error('Error filtering teachers:', error);
      throw new InternalServerErrorException('Error filtering teachers');
    }
  }

  /**
   * Find a single teacher by ID
   * 
   * @param id - Teacher ID
   * @returns Teacher with relations
   * @throws NotFoundException if teacher not found
   */
  async findOne(id: number): Promise<Teacher> {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id },
        include: {
          specialty: true,
          subjects: {
            include: {
              degree: true,
              cycle: true,
            },
          },
        },
      });

      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }

      return teacher;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching teacher:', error);
      throw new InternalServerErrorException('Error fetching teacher');
    }
  }

  /**
   * Create a new teacher
   * 
   * @param data - Teacher creation data
   * @returns Created teacher
   */
  async create(data: CreateTeacherDto): Promise<Teacher> {
    try {
      return await this.prisma.teacher.create({
        data,
        include: {
          specialty: true,
        },
      });
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw new InternalServerErrorException('Error creating teacher');
    }
  }

  /**
   * Update a teacher
   * 
   * @param id - Teacher ID
   * @param dto - Update data
   * @returns Updated teacher
   */
  async update(id: number, dto: any): Promise<Teacher> {
    try {
      return await this.prisma.teacher.update({
        where: { id },
        data: dto,
        include: {
          specialty: true,
          subjects: true,
        },
      });
    } catch (error) {
      console.error('Error updating teacher:', error);
      throw new InternalServerErrorException('Error updating teacher');
    }
  }

  /**
   * Delete a teacher
   * 
   * @param id - Teacher ID
   * @returns Deleted teacher
   */
  async remove(id: number): Promise<Teacher> {
    try {
      return await this.prisma.teacher.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      throw new InternalServerErrorException('Error deleting teacher');
    }
  }
}
