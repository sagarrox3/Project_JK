import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/models/user.schema';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user if validation is successful', async () => {
      const user = { email: 'test@example.com', password: 'hashedPassword' };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user as User);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      expect(await service.validateUser('test@example.com', 'password')).toBe(user);
    });

    it('should throw an UnauthorizedException if validation fails', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(service.validateUser('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { email: 'test@example.com', _id: '1' };
      const token = 'token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      expect(await service.login(user)).toEqual({ access_token: token });
    });
  });
});
