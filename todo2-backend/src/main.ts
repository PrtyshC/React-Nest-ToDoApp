import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend origin (change 3000 to the actual port if different)
  app.enableCors({
    origin: 'http://localhost:3000', // Allow the frontend to make requests to backend
    methods: 'GET,POST,PUT,DELETE,HEAD,PATCH', // Allow only specific methods if necessary
    allowedHeaders: 'Content-Type, Authorization', // Allow the necessary headers
  });

  await app.listen(4000);
}
bootstrap();
