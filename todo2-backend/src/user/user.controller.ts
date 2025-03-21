//user controller
import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { firstName: string, lastName: string, email: string; password: string }): Promise<User> {
    return this.userService.createUser(body.firstName, body.lastName, body.email, body.password);
  }

  @Post('find')
@HttpCode(HttpStatus.OK) 
async findUserByEmail(@Body() body: { email: string }): Promise<User> {
  const user = await this.userService.findUserByEmail(body.email);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

@UseGuards(JwtAuthGuard)
@Get()
@HttpCode(HttpStatus.OK) 
async getUser(@Request() req): Promise<User> {
  const user = await this.userService.findById(req.user.sub);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}
}