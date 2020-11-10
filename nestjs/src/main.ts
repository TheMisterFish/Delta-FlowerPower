import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = parseInt(process.env.PORT, 10) || 1000;
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(port);
}
bootstrap();
