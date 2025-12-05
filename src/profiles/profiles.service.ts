import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaProfilesService } from '../prisma/prisma-profiles.service';
import { CreateStudentProfileDto } from './dto/create-student-profile.dto';
import { CreateTeacherProfileDto } from './dto/create-teacher-profile.dto';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaProfilesService) { }

    // Student Profiles
    async findAllStudents() {
        return this.prisma.studentProfile.findMany({});
    }

    async findStudentById(id: number) {
        const profile = await this.prisma.studentProfile.findUnique({
            where: { id },
        });
        if (!profile) throw new NotFoundException('Student profile not found');
        return profile;
    }

    async updateStudentProfile(id: number, dto: Partial<CreateStudentProfileDto>) {
        return this.prisma.studentProfile.update({
            where: { id },
            data: dto,
        });
    }

    async deleteStudentProfile(id: number) {
        return this.prisma.studentProfile.delete({ where: { id } });
    }

    // Teacher Profiles
    async findAllTeachers() {
        return this.prisma.teacherProfile.findMany({});
    }

    async findTeacherById(id: number) {
        const profile = await this.prisma.teacherProfile.findUnique({
            where: { id },
        });
        if (!profile) throw new NotFoundException('Teacher profile not found');
        return profile;
    }

    async updateTeacherProfile(id: number, dto: Partial<CreateTeacherProfileDto>) {
        return this.prisma.teacherProfile.update({
            where: { id },
            data: dto,
        });
    }

    async deleteTeacherProfile(id: number) {
        return this.prisma.teacherProfile.delete({ where: { id } });
    }
}
