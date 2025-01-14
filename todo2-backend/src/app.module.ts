import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { ToDoModule } from './to-do/to-do.module';
import { ToDo } from './to-do/todo.entity';
import { JwtAuthModule } from './jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', 
      database: 'todo2-app.sqlite',
      entities: [User,ToDo],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ToDoModule,
    JwtAuthModule,
  ],
})
export class AppModule {}
