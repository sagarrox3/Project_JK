import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BlogDTO } from 'src/dto/blog.dto';
import { Blog } from 'src/models/blog.schema';
import { BlogsService } from 'src/service/blogs.service';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async getAllBlogs(@Req() req: Request): Promise<Blog[]> {
    return await this.blogsService.findAll();
  }

  @Get(':id')
  getBlog(@Param('id') id: string): Promise<Blog> {
    return this.blogsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createBlog(@Body() body: BlogDTO, @Req() req: any): Promise<Blog> {
    return this.blogsService.create(body.title, body.content, req.user.userId, body.tags);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateBlog(@Param('id') id: string, @Body() updateData: Partial<Blog>): Promise<Blog> {
    return this.blogsService.update(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteBlog(@Param('id') id: string): Promise<Blog> {
    return this.blogsService.delete(id);
  }
}
