import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.student.findMany({
      skip,
      take: limit,
      include: { degree: true, cycle: true },
    });
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: { degree: true, cycle: true },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  create(dto: CreateStudentDto) {
    return this.prisma.student.create({ data: dto });
  }

  async update(id: number, dto: any) {
    return this.prisma.student.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.student.delete({ where: { id } });
  }
}