import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaAcademicService } from '../prisma/prisma-academic.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Subject } from '@prisma/client-academic';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaAcademicService) { }

  /**
   * Find all subjects with pagination
   */
  async findAll(page = 1, limit = 10): Promise<Subject[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.prisma.subject.findMany({
        skip,
        take: limit,
        include: { teacher: true, degree: true, cycle: true },
      });
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw new InternalServerErrorException('Error fetching subjects');
    }
  }

  /**
   * PART 1 - DERIVED QUERY:
   * Get all subjects for a specific degree
   * 
   * @param degreeId - Degree ID
   * @returns Subjects associated with the degree
   */
  async findByDegree(degreeId: number): Promise<Subject[]> {
    try {
      return await this.prisma.subject.findMany({
        where: {
          degreeId,
        },
        include: {
          teacher: {
            include: {
              specialty: true,
            },
          },
          degree: true,
          cycle: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      console.error('Error fetching subjects by degree:', error);
      throw new InternalServerErrorException(
        'Error fetching subjects by degree',
      );
    }
  }

  /**
   * Check if a subject has available slots for enrollment
   * 
   * @param subjectId - Subject ID
   * @returns Availability status
   */
  async checkAvailability(subjectId: number): Promise<{
    available: boolean;
    availableSlots: number;
    maxSlots: number;
  }> {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id: subjectId },
        select: {
          availableSlots: true,
          maxSlots: true,
        },
      });

      if (!subject) {
        throw new NotFoundException(`Subject with ID ${subjectId} not found`);
      }

      return {
        available: subject.availableSlots > 0,
        availableSlots: subject.availableSlots,
        maxSlots: subject.maxSlots,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error checking subject availability:', error);
      throw new InternalServerErrorException(
        'Error checking subject availability',
      );
    }
  }

  /**
   * Find a single subject by ID
   */
  async findOne(id: number): Promise<Subject> {
    try {
      const subject = await this.prisma.subject.findUnique({
        where: { id },
        include: { teacher: true, degree: true, cycle: true },
      });

      if (!subject) {
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }

      return subject;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching subject:', error);
      throw new InternalServerErrorException('Error fetching subject');
    }
  }

  /**
   * Create a new subject
   */
  async create(dto: CreateSubjectDto): Promise<Subject> {
    try {
      return await this.prisma.subject.create({
        data: dto,
        include: { teacher: true, degree: true, cycle: true },
      });
    } catch (error) {
      console.error('Error creating subject:', error);
      throw new InternalServerErrorException('Error creating subject');
    }
  }

  /**
   * Update a subject
   */
  async update(id: number, dto: any): Promise<Subject> {
    try {
      return await this.prisma.subject.update({
        where: { id },
        data: dto,
        include: { teacher: true, degree: true, cycle: true },
      });
    } catch (error) {
      console.error('Error updating subject:', error);
      throw new InternalServerErrorException('Error updating subject');
    }
  }

  /**
   * Delete a subject
   */
  async remove(id: number): Promise<Subject> {
    try {
      return await this.prisma.subject.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw new InternalServerErrorException('Error deleting subject');
    }
  }
}
