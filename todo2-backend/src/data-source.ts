import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { ToDo } from './to-do/todo.entity';  

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'data.db',
  synchronize: false,  // Set to false to avoid overwriting the DB
  logging: true,
  entities: [User, ToDo],  
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
