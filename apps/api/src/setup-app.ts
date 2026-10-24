import helmet from '@fastify/helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';

/** HTTP adapter used by `main.ts` and e2e tests. */
export const createHttpAdapter = () => new FastifyAdapter();

/**
 * Global HTTP setup shared by `main.ts` and e2e tests,
 * so tests run against the exact same pipeline as production.
 */
export async function setupApp(
  app: NestFastifyApplication,
  corsOrigins: string[] = [],
) {
  await app.register(helmet, {
    // Swagger UI (/api/docs) needs inline styles and scripts.
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
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
