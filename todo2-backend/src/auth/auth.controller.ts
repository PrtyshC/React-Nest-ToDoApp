//auth controller
import { Controller, Post, Body, Request, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomJwtService } from '../jwt/custom-jwt.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customJwtService: CustomJwtService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Explicit status code for registration
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(firstName, lastName, email, password);
  }

  @Post('verify-token')
  @HttpCode(HttpStatus.OK) // Explicit status code for token verification
  verifyToken(@Request() req) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      const decoded = this.authService.verifyToken(token);
      return { isValid: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response,
  ) {
    const { access_token } = await this.authService.login(email, password);

    if (!access_token) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return response.status(HttpStatus.OK).json({
      message: 'Login successful',
      access_token,
    });
  }
}