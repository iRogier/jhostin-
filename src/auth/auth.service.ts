import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { PrismaUsersService } from '../prisma/prisma-users.service';
import { PrismaProfilesService } from '../prisma/prisma-profiles.service';
import { PrismaAcademicService } from '../prisma/prisma-academic.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaUsers: PrismaUsersService,
    private prismaProfiles: PrismaProfilesService,
    private prismaAcademic: PrismaAcademicService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, password: string) {
    // Search teacher first
    const teacher = await this.prismaUsers.teacherAuth.findUnique({ where: { email } });
    if (teacher && teacher.password) {
      const ok = await bcrypt.compare(password, teacher.password);
      if (ok) return { id: teacher.id, email: teacher.email, role: 'teacher' as const };
    }

    // fallback to students
    const student = await this.prismaUsers.studentAuth.findUnique({ where: { email } });
    if (student && student.password) {
      const ok = await bcrypt.compare(password, student.password);
      if (ok) return { id: student.id, email: student.email, role: 'student' as const };
    }

    return null;
  }

  async register(dto: RegisterDto) {
    try {
      // Check if email exists in all databases
      const existingTeacher = await this.prismaUsers.teacherAuth.findUnique({ where: { email: dto.email } });
      const existingStudent = await this.prismaUsers.studentAuth.findUnique({ where: { email: dto.email } });
      if (existingTeacher || existingStudent) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = bcrypt.hashSync(dto.password, 10);

      // 1. Create in Users DB (Authentication) - PRIMARY
      const authUser = await this.prismaUsers.teacherAuth.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      try {

        await this.prismaProfiles.teacherProfile.create({
          data: {
            id: authUser.id, // Use same ID
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
          },
        });

        try {
          await this.prismaAcademic.teacher.create({
            data: {
              id: authUser.id, // Use same ID
              firstName: dto.firstName,
              lastName: dto.lastName,
              email: dto.email,
            },
          });
        } catch (academicError) {
          console.warn('Failed to create teacher in Academic DB:', academicError);
        }

        return {
          id: authUser.id,
          email: authUser.email
        };

      } catch (profileError) {
        // Profiles DB is CRITICAL - rollback auth user if it fails
        await this.prismaUsers.teacherAuth.delete({ where: { id: authUser.id } });
        throw new InternalServerErrorException('Failed to create teacher profile');
      }

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async registerStudent(dto: RegisterDto) {
    try {
      // Check if email exists in all databases
      const existingTeacher = await this.prismaUsers.teacherAuth.findUnique({ where: { email: dto.email } });
      const existingStudent = await this.prismaUsers.studentAuth.findUnique({ where: { email: dto.email } });
      if (existingTeacher || existingStudent) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = bcrypt.hashSync(dto.password, 10);

      // 1. Create in Users DB (Authentication) - PRIMARY
      const authUser = await this.prismaUsers.studentAuth.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      try {
        // 2. Create in Profiles DB (Profile data) - CRITICAL
        await this.prismaProfiles.studentProfile.create({
          data: {
            id: authUser.id, // Use same ID
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
          },
        });

        // 3. Create in Academic DB (Academic data) - OPTIONAL
        try {
          await this.prismaAcademic.student.create({
            data: {
              id: authUser.id, // Use same ID
              firstName: dto.firstName,
              lastName: dto.lastName,
              email: dto.email,
            },
          });
        } catch (academicError) {
          // Academic DB is optional, log but don't fail
          console.warn('Failed to create student in Academic DB:', academicError);
        }

        // Remove password from response
        return { id: authUser.id, email: authUser.email };

      } catch (profileError) {
        // Profiles DB is CRITICAL - rollback auth user if it fails
        await this.prismaUsers.studentAuth.delete({ where: { id: authUser.id } });
        throw new InternalServerErrorException('Failed to create student profile');
      }

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(user: { id: number; email: string }) {
    // preserve role if present so JwtStrategy knows where to look
    const payload: any = { sub: user.id, email: user.email };
    if ((user as any).role) payload.role = (user as any).role;
    return { access_token: this.jwtService.sign(payload) };
  }

  async attemptLogin(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.login(user);
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error instanceof ConflictException ||
      error instanceof InternalServerErrorException ||
      error instanceof UnauthorizedException) {
      throw error;
    }

    console.error('Database error:', error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
