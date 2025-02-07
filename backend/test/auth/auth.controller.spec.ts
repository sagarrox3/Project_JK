import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/service/users.service';
import { User } from '../../src/models/user.schema';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const token = { access_token: 'token' };
      jest.spyOn(authService, 'validateUser').mockResolvedValue({ email: 'test@example.com' });
      jest.spyOn(authService, 'login').mockResolvedValue(token);

      expect(await controller.login({ email: 'test@example.com', password: 'password' })).toBe(token);
    });

    it('should throw an UnauthorizedException if validation fails', async () => {
      jest.spyOn(authService, 'validateUser').mockRejectedValue(new UnauthorizedException());

      await expect(controller.login({ email: 'test@example.com', password: 'password' })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user = { name: 'Test User', email: 'test@example.com', age: 25, password: 'password' };
      jest.spyOn(usersService, 'createUser').mockResolvedValue(user as User);

      expect(await controller.createUser(user)).toBe(user);
    });
  });
});
