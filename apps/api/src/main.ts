import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import type { AppConfig } from './core/config/configuration.js';
import { createHttpAdapter, setupApp } from './setup-app.js';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    createHttpAdapter(),
  );
  const config = app.get(ConfigService<AppConfig, true>);
  const { port, corsOrigins, env } = config.get('app', { infer: true });

  await setupApp(app, corsOrigins);
  app.enableShutdownHooks();

  if (env !== 'production') {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Ember API')
        .setDescription('Ember boilerplate REST API')
        .setVersion('1.0')
        .build(),
    );
    SwaggerModule.setup('api/docs', app, document);
  }

  // Fastify listens on 127.0.0.1 by default: bind all interfaces (Docker).
  await app.listen(port, '0.0.0.0');
  Logger.log(
    `🔥 Ember API running on http://localhost:${port}/api`,
    'Bootstrap',
  );
}
await bootstrap();
