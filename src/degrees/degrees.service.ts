import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDegreeDto } from './dto/create-degree.dto';

@Injectable()
export class DegreesService {
  constructor(private prisma: PrismaService) {}

  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.degree.findMany({ skip, take: limit });
  }

  async findOne(id: number) {
    const degree = await this.prisma.degree.findUnique({ where: { id } });
    if (!degree) throw new NotFoundException('Degree not found');
    return degree;
  }

  create(dto: CreateDegreeDto) {
    return this.prisma.degree.create({ data: dto });
  }

  async update(id: number, dto: any) {
    return this.prisma.degree.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.degree.delete({ where: { id } });
  }
}