import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { User } from './user.entity';
import { ToDo } from '../to-do/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let todoRepository: Repository<ToDo>;
  let accessToken: string;

  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'usertest@nw18.com',
    password: 'Test@1234',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userRepository = moduleFixture.get(getRepositoryToken(User));
    todoRepository = moduleFixture.get(getRepositoryToken(ToDo));

    // Clean database
    await todoRepository.query('PRAGMA foreign_keys = OFF;');
    await todoRepository.delete({});
    await userRepository.delete({});
    await todoRepository.query('PRAGMA foreign_keys = ON;');

    // Register user
    await request(app.getHttpServer()).post('/auth/register').send(testUser);

    // Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    accessToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await todoRepository.query('PRAGMA foreign_keys = OFF;');
    await todoRepository.delete({});
    await userRepository.delete({});
    await todoRepository.query('PRAGMA foreign_keys = ON;');
    await app.close();
  });

  describe('POST /user/find', () => {
    it('should return 404 if the user is not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/user/find')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toContain('User not found');
    });
  });

  describe('GET /user', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app.getHttpServer()).get('/user');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('No token provided');
    });

    it('should return 401 for an invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', 'Bearer InvalidToken');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('Invalid or expired token');
    });

  });
});

