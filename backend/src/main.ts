import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import helmet from '@fastify/helmet';
import fastifyCsrf from '@fastify/csrf-protection';
import compression from '@fastify/compress';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { env } from './env';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const PORT = env.PORT;
  const corsOrigin = '*';

  app.enableCors({
    origin: corsOrigin,
  });

  await app.register(helmet);
  await app.register(fastifyCsrf);
  await app.register(compression);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const openApiDoc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, openApiDoc);

  await app.listen(PORT ?? 8080);
  logger.log(`Application is running on: ${await app.getUrl()}/api/v1`);
  logger.log(`Api Docs are available on: ${await app.getUrl()}/docs`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application', err);
  process.exit(1);
});
