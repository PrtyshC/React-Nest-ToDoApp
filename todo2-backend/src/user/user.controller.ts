import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard'; 

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { firstName: string, lastName: string, email: string; password: string }): Promise<User> {
    return this.userService.createUser(body.firstName, body.lastName, body.email, body.password);
  }

  // Endpoint to find user by email
  @Post('find')
  async findUserByEmail(@Body() body: { email: string }): Promise<User> {
    return this.userService.findUserByEmail(body.email);
  }

  // GET endpoint to fetch the current user by their ID from the JWT token
  @UseGuards(JwtAuthGuard) // Protect the route with JWT authentication
  @Get()
  async getUser(@Request() req): Promise<User> {
    // The user is attached to the request object by the JwtAuthGuard
    return this.userService.findById(req.user.sub); // Fetch user by their ID
  }
}
