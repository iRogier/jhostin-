import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    teacher: { findFirst: jest.fn() },
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
    mockPrisma.teacher.findFirst.mockResolvedValue({ id: 1, email: 'a@b.com' });
    const user = await service.validateUser('a@b.com', 'password');
    expect(user).toEqual({ id: 1, email: 'a@b.com' });
  });

  it('should return null when teacher not found or wrong password', async () => {
    mockPrisma.teacher.findFirst.mockResolvedValue(null);
    expect(await service.validateUser('notfound', 'password')).toBeNull();

    mockPrisma.teacher.findFirst.mockResolvedValue({ id: 1, email: 'a@b.com' });
    expect(await service.validateUser('a@b.com', 'wrong')).toBeNull();
  });
});
