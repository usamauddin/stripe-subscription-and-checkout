import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true })
 
  app.enableCors({
    origin: "http://localhost:3000",
    methods: "GET, PUT, PATCH, POST, DELETE",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin']
  })

  await app.listen(4000);
  console.log('server running at port 4000');

}
bootstrap();