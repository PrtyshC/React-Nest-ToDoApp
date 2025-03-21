import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

// Mock UserService
const mockUserService = {
  createUser: jest.fn((firstName, lastName, email, password) => {
    return Promise.resolve({
      id: 'id',
      firstName,
      lastName,
      email,
      password,
      todos: [], 
    } as User);
  }),
  findUserByEmail: jest.fn((email) => {
    return Promise.resolve({
      id: 'id',
      firstName: 'John',
      lastName: 'Doe',
      email,
      todos: [], 
    } as User);
  }),
  findById: jest.fn((id) => {
    return Promise.resolve({
      id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      todos: [], 
    } as User);
  }),
};

// Mock JWT Auth Guard
class MockJwtAuthGuard {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    req.user = { sub: 'id' }; // Mock user ID from JWT
    return true;
  }
}

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(new MockJwtAuthGuard())
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userDto = { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', password: 'securepassword' };
      const result = await controller.register(userDto);
      
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        userDto.firstName,
        userDto.lastName,
        userDto.email,
        userDto.password
      );
      expect(result).toEqual(expect.objectContaining({ firstName: 'Alice', email: 'alice@example.com' }));
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const result = await controller.findUserByEmail({ email: 'test@example.com' });

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(expect.objectContaining({ email: 'test@example.com' }));
    });
  });

  describe('getUser', () => {
    it('should return the currently authenticated user', async () => {
      const req = { user: { sub: 1 } }; // Mock request with JWT user ID
      const result = await controller.getUser(req);

      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expect.objectContaining({ id: 1, email: 'test@example.com' }));
    });
  });
});
