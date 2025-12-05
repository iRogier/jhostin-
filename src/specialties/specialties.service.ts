import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaAcademicService } from '../prisma/prisma-academic.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(private prisma: PrismaAcademicService) { }

  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.specialty.findMany({ skip, take: limit });
  }

  async findOne(id: number) {
    const item = await this.prisma.specialty.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Specialty not found');
    return item;
  }

  create(dto: CreateSpecialtyDto) {
    return this.prisma.specialty.create({ data: dto });
  }

  async update(id: number, dto: any) {
    return this.prisma.specialty.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.specialty.delete({ where: { id } });
  }
}