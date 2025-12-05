import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProfilesService } from '../prisma/prisma-profiles.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaProfilesService) { }

  findAll() {
    return this.prisma.studentProfile.findMany({});
  }

  async findOne(id: number) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
    });
    if (!student) throw new NotFoundException('Student profile not found');
    return student;
  }

  async update(id: number, dto: any) {
    return this.prisma.studentProfile.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.studentProfile.delete({ where: { id } });
  }
}