import { Controller, Post, Body, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomJwtService } from 'src/jwt/custom-jwt.service';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customJwtService: CustomJwtService, // Injecting CustomJwtService
  ) {}

  @Post('register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.register(firstName, lastName, email, password);
  }

  @Post('verify-token')
  verifyToken(@Request() req) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      const decoded = this.authService.verifyToken(token); // JWT Verification
      return { isValid: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response, // Injecting response to send back the token
  ) {
    const { access_token } = await this.authService.login(email, password); 
    
    
    if (!access_token) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    return response.status(200).json({
      message: 'Login successful',
      access_token,
    });
  }
}
