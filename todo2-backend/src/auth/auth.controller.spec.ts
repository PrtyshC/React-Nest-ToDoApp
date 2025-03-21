import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomJwtService } from '../jwt/custom-jwt.service';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

// Mock AuthService
const mockAuthService = {
  register: jest.fn((firstName, lastName, email, password) => {
    return Promise.resolve({
      id: '1',
      firstName,
      lastName,
      email,
    });
  }),
  verifyToken: jest.fn((token) => {
    if (token === 'valid_token') return { userId: '1' };
    throw new UnauthorizedException('Invalid token');
  }),
  login: jest.fn((email, password) => {
    if (email === 'test@example.com' && password === 'password') {
      return Promise.resolve({ access_token: 'valid_token' });
    }
    throw new UnauthorizedException('Invalid credentials');
  }),
};

// Mock Response object
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CustomJwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userDto = { firstName: 'Alice', lastName: 'Smith', email: 'alice@nw18.com', password: 'securepassword' };
      const result = await controller.register(userDto.firstName, userDto.lastName, userDto.email, userDto.password);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        userDto.firstName,
        userDto.lastName,
        userDto.email,
        userDto.password,
      );
      expect(result).toEqual(expect.objectContaining({ firstName: 'Alice', email: 'alice@nw18.com' }));
    });
  });

  describe('verifyToken', () => {
    it('should return { isValid: true } for a valid token', () => {
      const req = { headers: { authorization: 'Bearer valid_token' } };
      const result = controller.verifyToken(req);

      expect(mockAuthService.verifyToken).toHaveBeenCalledWith('valid_token');
      expect(result).toEqual({ isValid: true });
    });

    it('should throw UnauthorizedException if token is missing', () => {
      const req = { headers: {} };

      expect(() => controller.verifyToken(req)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for an invalid token', () => {
      const req = { headers: { authorization: 'Bearer invalid_token' } };

      expect(() => controller.verifyToken(req)).toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return an access token for valid credentials', async () => {
      const req = { email: 'test@example.com', password: 'password' };
      const res = mockResponse();
      await controller.login(req.email, req.password, res);

      expect(mockAuthService.login).toHaveBeenCalledWith(req.email, req.password);
      expect(res.status).toHaveBeenCalledWith(200); // Updated to 200
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        access_token: 'valid_token',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const req = { email: 'wrong@example.com', password: 'wrongpass' };
      const res = mockResponse();

      await expect(controller.login(req.email, req.password, res)).rejects.toThrow(UnauthorizedException);
    });
  });
});