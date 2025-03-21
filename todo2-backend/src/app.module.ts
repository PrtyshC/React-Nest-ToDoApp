import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { ToDoModule } from './to-do/to-do.module';
import { ToDo } from './to-do/todo.entity';
import { JwtAuthModule } from './jwt/jwt.module';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.register({
      secret: 'superdupersecret',
      signOptions: { expiresIn: '1h' },
    }),
    JwtAuthModule,
  ],
})
export class AppModule {}
