import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../models/blog.schema';
import { User, UserDocument } from 'src/models/user.schema';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
              @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<any> {
    const blogs : Blog[] = await this.blogModel.find();
    return {
      code: true,
      message: 'Successfully fetched all the blogs',
      totalCount: blogs.length,
      blogs: blogs,
    }
  }

  async findOne(id: string): Promise<any> {
    const blog: Blog = await this.blogModel.findById(id);
    if(!blog) throw new HttpException('Blog not found with this ID', HttpStatus.NOT_FOUND);
    return {
      code: true,
      message: 'Successfully fetched the blog',
      blog: blog,
    }
  }

  async create(title: string, content: string, authorId: string, tags: string[]): Promise<any> {
    const newBlog = await this.blogModel.create({ title, content, tags, authorId });

    await this.userModel.findByIdAndUpdate(authorId, {
      $push: { blogs: newBlog._id },
    });
    return {
      code: true,
      message: 'Successfully created the blog',
      blog: newBlog,
    }
  }

  async update(id: string, updateData: Partial<Blog>): Promise<any> {
    const updatedBlog = await this.blogModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedBlog) throw new HttpException('Blog not found with this ID', HttpStatus.NOT_FOUND);
    return {
      code: true,
      message: 'Successfully updated the blog',
      blog: updatedBlog,
    };
  }

  async delete(id: string): Promise<any> {
    const deletedBlog = await this.blogModel.findByIdAndDelete(id).exec();
    if (!deletedBlog) throw new HttpException('Blog not found with this ID', HttpStatus.NOT_FOUND);
    return {
      code: true,
      message: 'Successfully deleted the blog',
      blog: deletedBlog,
    };
  }
}
