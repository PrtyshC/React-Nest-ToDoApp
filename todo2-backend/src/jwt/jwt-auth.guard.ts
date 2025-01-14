import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { CustomJwtService } from './custom-jwt.service';


@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: CustomJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
  
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }
  
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid token format');
    }
  
    console.log('Token received:', token); // Debug: Log token here
    try {
      const user = await this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (error) {
      console.error('JWT Verification Error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  
}
