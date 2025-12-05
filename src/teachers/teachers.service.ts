import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaAcademicService } from '../prisma/prisma-academic.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(private prisma: PrismaAcademicService) { }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.teacher.findMany({
      skip,
      take: limit,
    });
  }

  async findOne(id: number) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) throw new NotFoundException(`Teacher with ID ${id} not found`);
    return teacher;
  }

  async create(data: CreateTeacherDto) {
    return this.prisma.teacher.create({ data });
  }

  async update(id: number, dto: any) {
    return this.prisma.teacher.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.teacher.delete({ where: { id } });
  }
}
