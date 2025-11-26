import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    attemptLogin: jest.fn(),
    register: jest.fn(),
    registerStudent: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test', signOptions: { expiresIn: '1h' } })],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => jest.resetAllMocks());

  it('login should call attemptLogin and return token', async () => {
    mockAuthService.attemptLogin.mockResolvedValue({ access_token: 'token' });
    const result = await controller.login({ email: 'a@b.com', password: 'password' } as any);
    expect(mockAuthService.attemptLogin).toHaveBeenCalledWith('a@b.com', 'password');
    expect(result).toEqual({ access_token: 'token' });
  });

  it('register should call service.register and return created user', async () => {
    mockAuthService.register.mockResolvedValue({ id: 3, email: 'new@t.com' });
    const result = await controller.register({ firstName: 'A', lastName: 'B', email: 'new@t.com', password: 'secret' } as any);
    expect(mockAuthService.register).toHaveBeenCalledWith({ firstName: 'A', lastName: 'B', email: 'new@t.com', password: 'secret' });
    expect(result).toEqual({ id: 3, email: 'new@t.com' });
  });

  it('registerStudent should call service.registerStudent and return created user', async () => {
    mockAuthService.registerStudent.mockResolvedValue({ id: 4, email: 's@t.com' });
    const result = await controller.registerStudent({ firstName: 'S', lastName: 'T', email: 's@t.com', password: 'pwd' } as any);
    expect(mockAuthService.registerStudent).toHaveBeenCalledWith({ firstName: 'S', lastName: 'T', email: 's@t.com', password: 'pwd' });
    expect(result).toEqual({ id: 4, email: 's@t.com' });
  });

  it('profile should return user attached to request', () => {
    const req: any = { user: { id: 1, email: 'a@b.com' } };
    expect(controller.profile(req)).toEqual({ user: { id: 1, email: 'a@b.com' } });
  });
});
