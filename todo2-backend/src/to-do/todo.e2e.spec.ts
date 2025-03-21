import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { User } from '../user/user.entity';
import { ToDo } from './todo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ToDoController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let todoRepository: Repository<ToDo>;
  let accessToken: string;
  let todoId: string;

  const testUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'todotest@nw18.com',
    password: 'Test@1234',
  };

  const testTodo = { title: 'Test ToDo', description: 'Test Description' };

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

    // Register and login
    await request(app.getHttpServer()).post('/auth/register').send(testUser);
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    accessToken = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Create a new todo before each test
    const createRes = await request(app.getHttpServer())
      .post('/todos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(testTodo);
    expect(createRes.status).toBe(HttpStatus.CREATED);
    todoId = createRes.body.id;
  });

  afterEach(async () => {
    // Clean up todos after each test
    await todoRepository.delete({});
  });

  describe('DELETE /todos/:id', () => {
    it('should delete todo', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/todos/nonexistentId`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
