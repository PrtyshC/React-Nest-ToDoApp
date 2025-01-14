import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { CustomJwtService } from 'src/jwt/custom-jwt.service';
import { JwtAuthModule } from 'src/jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';  

@Module({
  imports: [
    UserModule,  
    JwtModule.register({
      secret: 'superdupersecret',  // Move secret to a config file or env variables
      signOptions: { expiresIn: '1h' },
    }),
    JwtAuthModule,
    ConfigModule.forRoot(),  
  ],
  providers: [AuthService, JwtAuthGuard, CustomJwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
