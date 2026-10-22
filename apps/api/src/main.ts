import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import type { AppConfig } from './config/configuration.js';
import { setupApp } from './setup-app.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<AppConfig, true>);
  const { port, corsOrigins, env } = config.get('app', { infer: true });

  setupApp(app, corsOrigins);
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

  await app.listen(port);
  Logger.log(
    `🔥 Ember API running on http://localhost:${port}/api`,
    'Bootstrap',
  );
}
await bootstrap();
