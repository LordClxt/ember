import { type INestApplication, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe.js';

/**
 * Global HTTP setup shared by `main.ts` and e2e tests,
 * so tests run against the exact same pipeline as production.
 */
export function setupApp(app: INestApplication, corsOrigins: string[] = []) {
  app.use(helmet());
  app.enableCors({ origin: corsOrigins });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  // Validates every DTO built from an `@ember/contracts` schema.
  app.useGlobalPipes(new ZodValidationPipe());
  return app;
}
