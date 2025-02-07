import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BlogsService } from '../../src/service/blogs.service';
import { Blog } from '../../src/models/blog.schema';
import { User } from '../../src/models/user.schema';
import { HttpException } from '@nestjs/common';

describe('BlogsService', () => {
  let service: BlogsService;
  let blogModel: any;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        {
          provide: getModelToken(Blog.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: getModelToken(User.name),
          useValue: {
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
    blogModel = module.get(getModelToken(Blog.name));
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all blogs', async () => {
      const blogs = [{ title: 'Test Blog' }];
      blogModel.find.mockResolvedValue(blogs);

      const result = await service.findAll();
      expect(result).toEqual({
        code: true,
        message: 'Successfully fetched all the blogs',
        totalCount: blogs.length,
        blogs: blogs,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single blog', async () => {
      const blog = { title: 'Test Blog' };
      blogModel.findById.mockResolvedValue(blog);

      const result = await service.findOne('1');
      expect(result).toEqual({
        code: true,
        message: 'Successfully fetched the blog',
        blog: blog,
      });
    });

    it('should throw an error if blog not found', async () => {
      blogModel.findById.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create a new blog', async () => {
      const newBlog = { title: 'Test Blog', _id: '1' };
      blogModel.create.mockResolvedValue(newBlog);
      userModel.findByIdAndUpdate.mockResolvedValue(null);

      const result = await service.create('Test Blog', 'Content', '1', ['tag1']);
      expect(result).toEqual({
        code: true,
        message: 'Successfully created the blog',
        blog: newBlog,
      });
    });
  });

  describe('update', () => {
    it('should update a blog', async () => {
      const updatedBlog = { title: 'Updated Blog' };
      blogModel.findByIdAndUpdate.mockResolvedValue(updatedBlog);

      const result = await service.update('1', { title: 'Updated Blog' });
      expect(result).toEqual({
        code: true,
        message: 'Successfully updated the blog',
        blog: updatedBlog,
      });
    });

    it('should throw an error if blog not found', async () => {
      blogModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update('1', { title: 'Updated Blog' })).rejects.toThrow(HttpException);
    });
  });

  describe('delete', () => {
    it('should delete a blog', async () => {
      const deletedBlog = { title: 'Deleted Blog' };
      blogModel.findByIdAndDelete.mockResolvedValue(deletedBlog);

      const result = await service.delete('1');
      expect(result).toEqual({
        code: true,
        message: 'Successfully deleted the blog',
        blog: deletedBlog,
      });
    });

    it('should throw an error if blog not found', async () => {
      blogModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.delete('1')).rejects.toThrow(HttpException);
    });
  });
});
