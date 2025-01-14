import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'; 
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CustomJwtService } from 'src/jwt/custom-jwt.service';
import { JwtPayload } from 'src/jwt/jwt.payload.interface';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, 
    private jwtService: CustomJwtService,
  ) {}

  // Register function
  async register(firstName: string, lastName: string, email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email); // Use UserService to find the user
    if (existingUser) {
      throw new Error('User already exists');
    }

    
    return await this.userService.createUser(firstName, lastName, email, password); // Pass plaintext password
  }

  // Login function
  async login(email: string, password: string): Promise<{ access_token: string }> {
    
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);

    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    //Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.generateToken(payload);

    // Exclude sensitive information like password before returning
    const { password: _, ...result } = user;  

    return { access_token };
  }

  verifyToken(token: string): JwtPayload {
    try {
      // Verify the token and return the decoded payload
      const decoded = this.jwtService.verify(token); 
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
