import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '../models/user.schema';
import { UsersService } from 'src/service/users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }
}
