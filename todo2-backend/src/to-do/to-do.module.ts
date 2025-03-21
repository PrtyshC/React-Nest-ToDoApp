// todo.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDo } from './todo.entity';
import { ToDoService } from './to-do.service';
import { ToDoController } from './to-do.controller';
import { User } from '../user/user.entity'; 
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtAuthModule } from '../jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([ToDo, User]), AuthModule,JwtAuthModule],
  providers: [ToDoService],
  controllers: [ToDoController],
})
export class ToDoModule {}
