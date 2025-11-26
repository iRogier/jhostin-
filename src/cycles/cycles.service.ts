import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCycleDto } from './dto/create-cycle.dto';

@Injectable()
export class CyclesService {
  constructor(private prisma: PrismaService) {}

  findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.cycle.findMany({ skip, take: limit });
  }

  async findOne(id: number) {
    const cycle = await this.prisma.cycle.findUnique({ where: { id } });
    if (!cycle) throw new NotFoundException('Cycle not found');
    return cycle;
  }

  create(dto: CreateCycleDto) {
    return this.prisma.cycle.create({ data: dto });
  }

  async update(id: number, dto: any) {
    return this.prisma.cycle.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.cycle.delete({ where: { id } });
  }
}