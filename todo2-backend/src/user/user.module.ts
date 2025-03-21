import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';  
import { CustomJwtService } from '../jwt/custom-jwt.service';
import { JwtAuthModule } from '../jwt/jwt.module';
import { ConfigService } from '@nestjs/config';
import { ToDoModule } from '../to-do/to-do.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'superdupersecret', // Replace with your actual secret or use an environment variable
      signOptions: { expiresIn: '1h' },  // Set token expiry time
    }),
    JwtAuthModule,
    
    
  ],
  providers: [UserService,CustomJwtService,ConfigService],
  controllers: [UserController],
  exports: [UserService],  
})
export class UserModule {}
