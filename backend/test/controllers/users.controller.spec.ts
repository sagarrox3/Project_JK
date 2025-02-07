import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/controller/users.controller';
import { UsersService } from '../../src/service/users.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { User } from '../../src/models/user.schema';
import { HttpException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result = [{ name: 'Test User' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.getAllUsers()).toBe(result);
    });
  });

  describe('getUser', () => {
    it('should return a single user', async () => {
      const result = { name: 'Test User' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.getUser('1')).toBe(result);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new HttpException('User not found', 404));

      await expect(controller.getUser('1')).rejects.toThrow(HttpException);
    });
  });
});
