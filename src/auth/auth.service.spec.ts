import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    teacher: { findUnique: jest.fn(), create: jest.fn() },
    student: { findUnique: jest.fn(), create: jest.fn() },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test', signOptions: { expiresIn: '1h' } })],
      providers: [AuthService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    // override injection token with actual class token used in project
    service = module.get<AuthService>(AuthService);
    // manually attach prisma to instance for tests
    (service as any).prisma = mockPrisma;
  });

  afterEach(() => jest.resetAllMocks());

  it('should validate user when teacher exists and password correct', async () => {
    const hash = await bcrypt.hash('password', 10);
    mockPrisma.teacher.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com', password: hash });
    const user = await service.validateUser('a@b.com', 'password');
    expect(user).toEqual({ id: 1, email: 'a@b.com', role: 'teacher' });
  });

  it('should validate user when student exists and password correct', async () => {
    const hash = await bcrypt.hash('password', 10);
    mockPrisma.teacher.findUnique.mockResolvedValue(null);
    mockPrisma.student.findUnique.mockResolvedValue({ id: 5, email: 's@b.com', password: hash });
    const user = await service.validateUser('s@b.com', 'password');
    expect(user).toEqual({ id: 5, email: 's@b.com', role: 'student' });
  });

  it('should return null when teacher not found or wrong password', async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue(null);
    mockPrisma.student.findUnique.mockResolvedValue(null);
    expect(await service.validateUser('notfound', 'password')).toBeNull();

    const hash = await bcrypt.hash('password', 10);
    mockPrisma.teacher.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com', password: hash });
    expect(await service.validateUser('a@b.com', 'wrong')).toBeNull();
  });

  it('register should create a teacher when email is new and return id/email', async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue(null);
    mockPrisma.student.findUnique.mockResolvedValue(null);
    mockPrisma.teacher.create.mockResolvedValue({ id: 2, email: 'new@t.com' });

    const res = await service.register({ firstName: 'A', lastName: 'B', email: 'new@t.com', password: 'secret' } as any);
    expect(mockPrisma.teacher.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 2, email: 'new@t.com' });
  });

  it('register should throw ConflictException when email exists (teacher or student)', async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue({ id: 1, email: 'exists@t.com' });
    await expect(service.register({ firstName: 'A', lastName: 'B', email: 'exists@t.com', password: 'secret' } as any)).rejects.toThrow();

    mockPrisma.teacher.findUnique.mockResolvedValue(null);
    mockPrisma.student.findUnique.mockResolvedValue({ id: 9, email: 'exists@t.com' });
    await expect(service.register({ firstName: 'A', lastName: 'B', email: 'exists@t.com', password: 'secret' } as any)).rejects.toThrow();
  });

  it('registerStudent should create a student when email is new and return id/email', async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue(null);
    mockPrisma.student.findUnique.mockResolvedValue(null);
    mockPrisma.student.create.mockResolvedValue({ id: 11, email: 'stud@t.com' });

    const res = await service.registerStudent({ firstName: 'X', lastName: 'Y', email: 'stud@t.com', password: 'secret' } as any);
    expect(mockPrisma.student.create).toHaveBeenCalled();
    expect(res).toEqual({ id: 11, email: 'stud@t.com' });
  });

  it('registerStudent should throw when email already exists', async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue({ id: 1, email: 'taken@t.com' });
    await expect(service.registerStudent({ firstName: 'X', lastName: 'Y', email: 'taken@t.com', password: 'secret' } as any)).rejects.toThrow();
  });
});
