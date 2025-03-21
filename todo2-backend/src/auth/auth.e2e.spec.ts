//auth e2e
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { User } from '../user/user.entity';
import { ToDo } from '../to-do/todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let todoRepository: Repository<ToDo>;
  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'authtest@nw18.com',
    password: 'Test@1234',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get repositories
    userRepository = moduleFixture.get(getRepositoryToken(User));
    todoRepository = moduleFixture.get(getRepositoryToken(ToDo));

    // Clean database
    await todoRepository.query('PRAGMA foreign_keys = OFF;');
    await todoRepository.delete({});
    await userRepository.delete({});
    await todoRepository.query('PRAGMA foreign_keys = ON;');
  });

  afterEach(async () => {
    // Clean after each test
    await todoRepository.query('PRAGMA foreign_keys = OFF;');
    await todoRepository.delete({});
    await userRepository.delete({});
    await todoRepository.query('PRAGMA foreign_keys = ON;');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', testUser.email);
    });

    it('should return 409 if email exists', async () => {
      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      // Second registration
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      expect(response.status).toBe(HttpStatus.CONFLICT);
      expect(response.body.message).toContain('User already exists');
    });
  });


  describe('POST /auth/login', () => {
    it('should log in an existing user', async () => {
      // Register user first
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      // Login attempt
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('access_token');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: 'WrongPassword' });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('POST /auth/verify-token', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Register and login to get token
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      accessToken = loginResponse.body.access_token;
    });

    it('should verify a valid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/verify-token')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual({ isValid: true });
    });

    it('should return 401 for an invalid token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/verify-token')
        .set('Authorization', 'Bearer InvalidToken');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('Invalid token');
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/verify-token');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('Token is required');
    });
  });
});