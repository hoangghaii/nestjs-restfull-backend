import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // enable CORS for all origins

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(process.env.PORT || 3002);
}
bootstrap();
