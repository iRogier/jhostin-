import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    attemptLogin: jest.fn(),
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

  it('profile should return user attached to request', () => {
    const req: any = { user: { id: 1, email: 'a@b.com' } };
    expect(controller.profile(req)).toEqual({ user: { id: 1, email: 'a@b.com' } });
  });
});
