import { Module } from '@nestjs/common';
import { JwtService as NestJwtService , JwtModule as NestJwtModule} from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { CustomJwtService } from './custom-jwt.service'; 

@Module({
  imports: [
    NestJwtModule.register({
      secret: "superdupersecret",
      signOptions: { expiresIn: "1h" },
    }),
    ConfigModule.forRoot(),
  ],
  providers: [CustomJwtService], 
  exports: [CustomJwtService], 
})
export class JwtAuthModule {}
