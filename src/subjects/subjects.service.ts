import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.subject.findMany({
      skip,
      take: limit,
      include: { teacher: true, degree: true, cycle: true },
    });
  }

  async findOne(id: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: { teacher: true, degree: true, cycle: true },
    });
    if (!subject) throw new NotFoundException('Subject not found');
    return subject;
  }

  create(dto: CreateSubjectDto) {
    return this.prisma.subject.create({ data: dto });
  }

  async update(id: number, dto: any) {
    return this.prisma.subject.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.subject.delete({ where: { id } });
  }
}