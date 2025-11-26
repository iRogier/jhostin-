import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    // Search teacher first
    const teacher = await this.prisma.teacher.findUnique({ where: { email } });
    if (teacher && teacher.password) {
      const ok = await bcrypt.compare(password, teacher.password);
      if (ok) return { id: teacher.id, email: teacher.email, role: 'teacher' as const };
    }

    // fallback to students
    const student = await this.prisma.student.findUnique({ where: { email } });
    if (student && student.password) {
      const ok = await bcrypt.compare(password, student.password);
      if (ok) return { id: student.id, email: student.email, role: 'student' as const };
    }

    return null;
  }

  async register(dto: RegisterDto) {
    // check if email exists
    const existingTeacher = await this.prisma.teacher.findUnique({ where: { email: dto.email } });
    const existingStudent = await this.prisma.student.findUnique({ where: { email: dto.email } });
    if (existingTeacher || existingStudent) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.prisma.teacher.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashed,
      },
    });

    return { id: created.id, email: created.email };
  }

  async registerStudent(dto: RegisterDto) {
    const existingTeacher = await this.prisma.teacher.findUnique({ where: { email: dto.email } });
    const existingStudent = await this.prisma.student.findUnique({ where: { email: dto.email } });
    if (existingTeacher || existingStudent) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.prisma.student.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashed,
      },
    });

    return { id: created.id, email: created.email };
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
}
