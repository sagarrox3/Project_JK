import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from '../../src/controller/blogs.controller';
import { BlogsService } from '../../src/service/blogs.service';
import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { BlogDTO } from '../../src/dto/blog.dto';
import { Blog } from '../../src/models/blog.schema';
import { HttpException } from '@nestjs/common';


describe('BlogsController', () => {
  let controller: BlogsController;
  let service: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [
        {
          provide: BlogsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
    service = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllBlogs', () => {
    it('should return an array of blogs', async () => {
      const result = [{ title: 'Test Blog' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);
      const request: Request = new Request();
      expect(await controller.getAllBlogs()).toBe(result);
    });
  });

  describe('getBlog', () => {
    it('should return a single blog', async () => {
      const result = { title: 'Test Blog' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.getBlog('1')).toBe(result);
    });

    it('should throw an error if blog not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new HttpException('Blog not found', 404));

      await expect(controller.getBlog('1')).rejects.toThrow(HttpException);
    });
  });

  describe('createBlog', () => {
    it('should create a new blog', async () => {
      const result = { title: 'Test Blog' };
      const blogDTO: BlogDTO = { title: 'Test Blog', content: 'Content', tags: [] };
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.createBlog(blogDTO, { user: { userId: '1' } })).toBe(result);
    });
  });

  describe('updateBlog', () => {
    it('should update a blog', async () => {
      const result = { title: 'Updated Blog' };
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.updateBlog('1', { title: 'Updated Blog' })).toBe(result);
    });

    it('should throw an error if blog not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new HttpException('Blog not found', 404));

      await expect(controller.updateBlog('1', { title: 'Updated Blog' })).rejects.toThrow(HttpException);
    });
  });

  describe('deleteBlog', () => {
    it('should delete a blog', async () => {
      const result = { title: 'Deleted Blog' };
      jest.spyOn(service, 'delete').mockResolvedValue(result);

      expect(await controller.deleteBlog('1')).toBe(result);
    });

    it('should throw an error if blog not found', async () => {
      jest.spyOn(service, 'delete').mockRejectedValue(new HttpException('Blog not found', 404));

      await expect(controller.deleteBlog('1')).rejects.toThrow(HttpException);
    });
  });
});
