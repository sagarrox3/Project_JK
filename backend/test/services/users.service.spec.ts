import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from '../../src/service/users.service';
import { User } from '../../src/models/user.schema';
import { HttpException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ name: 'Test User' }];
      userModel.find.mockResolvedValue(users);

      const result = await service.findAll();
      expect(result).toEqual({
        code: true,
        message: 'Successfully fetched all the users',
        totalCount: users.length,
        users: users,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user = { name: 'Test User' };
      userModel.findById.mockResolvedValue(user);

      const result = await service.findOne('1');
      expect(result).toEqual({
        code: true,
        message: 'Successfully fetched the user',
        user: user,
      });
    });

    it('should throw an error if user not found', async () => {
      userModel.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'Test User', _id: '1' };
      userModel.create.mockResolvedValue(newUser);

      const result = await service.createUser({ name: 'Test User' });
      expect(result).toEqual({
        code: true,
        message: 'Successfully created the user',
        user: newUser,
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updatedUser = { name: 'Updated User' };
      userModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.update('1', { name: 'Updated User' });
      expect(result).toEqual({
        code: true,
        message: 'Successfully updated the user',
        user: updatedUser,
      });
    });

    it('should throw an error if user not found', async () => {
      userModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Updated User' })).rejects.toThrow(HttpException);
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const deletedUser = { name: 'Deleted User' };
      userModel.findByIdAndDelete.mockResolvedValue(deletedUser);

      const result = await service.delete('1');
      expect(result).toEqual({
        code: true,
        message: 'Successfully deleted the user',
        user: deletedUser,
      });
    });

    it('should throw an error if user not found', async () => {
      userModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(HttpException);
    });
  });
});
