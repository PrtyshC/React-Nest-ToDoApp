import { Test, TestingModule } from '@nestjs/testing';
import { ToDoController } from './to-do.controller';
import { ToDoService } from './to-do.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { CustomJwtService } from '../jwt/custom-jwt.service';

// Mock ToDoService
const mockToDoService = {
  getToDos: jest.fn((userId) => {
    return Promise.resolve([
      { id: '1', title: 'Test Task', description: 'Description', completed: false, userId },
    ]);
  }),
  createToDo: jest.fn((userId, title, description) => {
    return Promise.resolve({ id: '1', title, description, completed: false, userId });
  }),
  updateToDo: jest.fn((userId, id, title, description, completed) => {
    return Promise.resolve({ id, title, description, completed, userId });
  }),
  deleteToDo: jest.fn((userId, id) => {
    return Promise.resolve(true);
  }),
};

// Mock JwtAuthGuard
const mockJwtAuthGuard = {
  canActivate: jest.fn(() => true),
};

// Mock CustomJwtService
const mockCustomJwtService = {
  verify: jest.fn(),
};

describe('ToDoController', () => {
  let controller: ToDoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToDoController],
      providers: [
        { provide: ToDoService, useValue: mockToDoService },
        { provide: JwtAuthGuard, useValue: mockJwtAuthGuard },
        { provide: CustomJwtService, useValue: mockCustomJwtService },
      ],
    }).compile();

    controller = module.get<ToDoController>(ToDoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getToDos', () => {
    it('should return a list of todos', async () => {
      const req = { user: { sub: 'user123' } };
      const result = await controller.getToDos(req);

      expect(mockToDoService.getToDos).toHaveBeenCalledWith('user123');
      expect(result).toEqual({
        success: true,
        todos: expect.arrayContaining([
          expect.objectContaining({ title: 'Test Task', description: 'Description' }),
        ]),
      });
    });

    it('should throw an error if user is invalid', async () => {
      const req = { user: null };

      await expect(controller.getToDos(req)).rejects.toThrow(HttpException);
    });
  });

  describe('createToDo', () => {
    it('should create a new todo', async () => {
      const req = { user: { sub: 'user123' } };
      const body = { title: 'New Task', description: 'New Description' };

      const result = await controller.createToDo(req, body.title, body.description);

      expect(mockToDoService.createToDo).toHaveBeenCalledWith('user123', body.title, body.description);
      expect(result).toEqual({
        success: true,
        todo: expect.objectContaining({ title: 'New Task', description: 'New Description' }),
      });
    });

    it('should throw an error if user is invalid', async () => {
      const req = { user: null };
      const body = { title: 'New Task', description: 'New Description' };

      await expect(controller.createToDo(req, body.title, body.description)).rejects.toThrow(HttpException);
    });
  });

  describe('updateToDo', () => {
    it('should update a todo', async () => {
      const req = { user: { sub: 'user123' } };
      const body = { title: 'Updated Task', description: 'Updated Description', completed: true };

      const result = await controller.updateToDo('1', req, body.title, body.description, body.completed);

      expect(mockToDoService.updateToDo).toHaveBeenCalledWith(
        'user123',
        '1',
        body.title,
        body.description,
        body.completed
      );
      expect(result).toEqual({
        success: true,
        updatedTodo: expect.objectContaining({ title: 'Updated Task', completed: true }),
      });
    });

    it('should throw an error if user is invalid', async () => {
      const req = { user: null };
      const body = { title: 'Updated Task', description: 'Updated Description', completed: true };

      await expect(controller.updateToDo('1', req, body.title, body.description, body.completed)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('deleteToDo', () => {
    it('should delete a todo', async () => {
      const req = { user: { sub: 'user123' } };
      const result = await controller.deleteToDo('1', req);

      expect(mockToDoService.deleteToDo).toHaveBeenCalledWith('user123', '1');
      expect(result).toEqual({ success: true, message: 'Todo deleted successfully' });
    });

    it('should throw an error if user is invalid', async () => {
      const req = { user: null };

      await expect(controller.deleteToDo('1', req)).rejects.toThrow(HttpException);
    });
  });
});
