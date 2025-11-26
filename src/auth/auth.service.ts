import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    // For this project we validate users against the teachers table
    // email is not a unique column in the current schema, use findFirst()
    const teacher = await this.prisma.teacher.findFirst({ where: { email } });
    if (!teacher) return null;

    // NOTE: current schema does not store passwords.
    // For demo & tests we expect the password to be exactly "password". Change this logic
    // to use hashed passwords if you add a password field to your model.
    if (password !== 'password') return null;

    // return a safe partial user object
    return { id: teacher.id, email: teacher.email };
  }

  async login(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload) };
  }

  async attemptLogin(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.login(user);
  }
}
