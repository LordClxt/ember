/**
 * Typed configuration factory. Read values with
 * `configService.get('app.port', { infer: true })`.
 */
export const configuration = () => ({
  app: {
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:4200')
      .split(',')
      .map((origin) => origin.trim()),
  },
});

export type AppConfig = ReturnType<typeof configuration>;
