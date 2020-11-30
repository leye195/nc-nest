import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // validation pipe (middle 비슷하게 생각해도 됨)
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true, // 유저가 보낸 것을 원하는 실제 타입으로 전환
    }),
  );
  await app.listen(3000);
}
bootstrap();
