import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaAcademicService } from '../prisma/prisma-academic.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { FilterEnrollmentDto } from './dto/filter-enrollment.dto';
import { Enrollment } from '@prisma/client-academic';

@Injectable()
export class EnrollmentsService {
    constructor(private prisma: PrismaAcademicService) { }

    /**
     * Creates a new enrollment using ACID-compliant transaction
     * 
     * ATOMICITY: All operations succeed or all fail (transaction rollback)
     * CONSISTENCY: Data validation ensures database integrity
     * ISOLATION: Serializable transaction prevents concurrent conflicts
     * DURABILITY: Once committed, enrollment is permanently stored
     * 
     * @param dto - Enrollment creation data
     * @returns Created enrollment with student and subject details
     * @throws BadRequestException if student is inactive
     * @throws ConflictException if no slots available or enrollment exists
     */
    async create(dto: CreateEnrollmentDto): Promise<Enrollment> {
        try {
            // Use interactive transaction with serializable isolation level
            const enrollment = await this.prisma.$transaction(
                async (tx) => {
                    // Step 1: Verify student exists and is active
                    const student = await tx.student.findUnique({
                        where: { id: dto.studentId },
                    });

                    if (!student) {
                        throw new NotFoundException(
                            `Student with ID ${dto.studentId} not found`,
                        );
                    }

                    if (!student.isActive) {
                        throw new BadRequestException(
                            `Student ${student.firstName} ${student.lastName} is not active`,
                        );
                    }

                    // Step 2: Verify subject exists and has available slots
                    const subject = await tx.subject.findUnique({
                        where: { id: dto.subjectId },
                    });

                    if (!subject) {
                        throw new NotFoundException(
                            `Subject with ID ${dto.subjectId} not found`,
                        );
                    }

                    if (subject.availableSlots <= 0) {
                        throw new ConflictException(
                            `Subject ${subject.name} has no available slots`,
                        );
                    }

                    // Step 3: Check if enrollment already exists
                    const existingEnrollment = await tx.enrollment.findFirst({
                        where: {
                            studentId: dto.studentId,
                            subjectId: dto.subjectId,
                            academicPeriod: dto.academicPeriod,
                        },
                    });

                    if (existingEnrollment) {
                        throw new ConflictException(
                            `Student is already enrolled in this subject for period ${dto.academicPeriod}`,
                        );
                    }

                    // Step 4: Create enrollment
                    const newEnrollment = await tx.enrollment.create({
                        data: {
                            studentId: dto.studentId,
                            subjectId: dto.subjectId,
                            academicPeriod: dto.academicPeriod,
                            status: dto.status || 'ACTIVE',
                        },
                        include: {
                            student: true,
                            subject: true,
                        },
                    });

                    // Step 5: Decrement available slots
                    await tx.subject.update({
                        where: { id: dto.subjectId },
                        data: {
                            availableSlots: {
                                decrement: 1,
                            },
                        },
                    });

                    return newEnrollment;
                },
                {
                    // Serializable isolation level for maximum consistency
                    isolationLevel: 'Serializable',
                },
            );

            return enrollment;
        } catch (error) {
            // Re-throw known exceptions
            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException ||
                error instanceof ConflictException
            ) {
                throw error;
            }

            // Handle unexpected errors
            console.error('Enrollment creation error:', error);
            throw new InternalServerErrorException(
                'An error occurred while creating enrollment',
            );
        }
    }

    /**
     * Find all enrollments with optional filtering
     * 
     * @param filter - Optional filter criteria
     * @returns List of enrollments matching criteria
     */
    async findAll(filter?: FilterEnrollmentDto): Promise<Enrollment[]> {
        try {
            const where: any = {};

            if (filter?.studentId) {
                where.studentId = filter.studentId;
            }

            if (filter?.subjectId) {
                where.subjectId = filter.subjectId;
            }

            if (filter?.academicPeriod) {
                where.academicPeriod = filter.academicPeriod;
            }

            if (filter?.status) {
                where.status = filter.status;
            }

            return await this.prisma.enrollment.findMany({
                where,
                include: {
                    student: {
                        include: {
                            degree: true,
                        },
                    },
                    subject: {
                        include: {
                            teacher: true,
                        },
                    },
                },
                orderBy: {
                    enrollmentDate: 'desc',
                },
            });
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            throw new InternalServerErrorException('Error fetching enrollments');
        }
    }

    /**
     * Find a single enrollment by ID
     * 
     * @param id - Enrollment ID
     * @returns Enrollment with related data
     * @throws NotFoundException if enrollment not found
     */
    async findOne(id: number): Promise<Enrollment> {
        try {
            const enrollment = await this.prisma.enrollment.findUnique({
                where: { id },
                include: {
                    student: {
                        include: {
                            degree: true,
                        },
                    },
                    subject: {
                        include: {
                            teacher: true,
                            degree: true,
                        },
                    },
                },
            });

            if (!enrollment) {
                throw new NotFoundException(`Enrollment with ID ${id} not found`);
            }

            return enrollment;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error fetching enrollment:', error);
            throw new InternalServerErrorException('Error fetching enrollment');
        }
    }

    /**
     * Get enrollments by student for a specific academic period
     * 
     * @param studentId - Student ID
     * @param academicPeriod - Academic period (e.g., "2024-1")
     * @returns List of student enrollments for the period
     */
    async findByStudentAndPeriod(
        studentId: number,
        academicPeriod: string,
    ): Promise<Enrollment[]> {
        try {
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
            });
        } catch (error) {
            console.error('Error fetching student enrollments:', error);
            throw new InternalServerErrorException(
                'Error fetching student enrollments',
            );
        }
    }

    /**
     * Delete an enrollment (with transaction to restore slot)
     * 
     * @param id - Enrollment ID
     * @returns Deleted enrollment
     */
    async remove(id: number): Promise<Enrollment> {
        try {
            return await this.prisma.$transaction(async (tx) => {
                const enrollment = await tx.enrollment.findUnique({
                    where: { id },
                });

                if (!enrollment) {
                    throw new NotFoundException(`Enrollment with ID ${id} not found`);
                }

                // Delete enrollment
                const deleted = await tx.enrollment.delete({
                    where: { id },
                });

                // Restore available slot
                await tx.subject.update({
                    where: { id: enrollment.subjectId },
                    data: {
                        availableSlots: {
                            increment: 1,
                        },
                    },
                });

                return deleted;
            });
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Error deleting enrollment:', error);
            throw new InternalServerErrorException('Error deleting enrollment');
        }
    }
}
