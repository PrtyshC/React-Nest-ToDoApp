import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Method to generate JWT token
  generateToken(payload: any): string {
    const secret = this.configService.get<string>('superdupersecret');  // Replace with your actual secret key
    const expiresIn = '1h';  
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  // Method to verify JWT token
  verify(token: string): any {
    const secret = this.configService.get<string>('superdupersecret');  // Replace with your actual secret key
    try {
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Decode JWT token (useful for debugging)
  decode(token: string): any {
    return this.jwtService.decode(token);
  }
}
