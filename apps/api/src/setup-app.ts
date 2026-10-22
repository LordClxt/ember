import {
  type INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';

/**
 * Global HTTP setup shared by `main.ts` and e2e tests,
 * so tests run against the exact same pipeline as production.
 */
export function setupApp(app: INestApplication, corsOrigins: string[] = []) {
  app.use(helmet());
  app.enableCors({ origin: corsOrigins });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  return app;
}
