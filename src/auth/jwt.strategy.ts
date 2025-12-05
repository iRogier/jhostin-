import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaUsersService } from '../prisma/prisma-users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaUsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'change_this_secret',
    });
  }

  async validate(payload: any) {
    // attach minimal user info: check which role the token represents
    if (payload.role === 'student') {
      const student = await this.prisma.studentAuth.findUnique({ where: { id: payload.sub } });
      if (!student) return null;
      return { id: student.id, email: student.email, role: 'student' };
    }

    // default: teacher
    const teacher = await this.prisma.teacherAuth.findUnique({ where: { id: payload.sub } });
    if (!teacher) return null;
    return { id: teacher.id, email: teacher.email, role: 'teacher' };
  }
}
