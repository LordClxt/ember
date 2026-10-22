import {
  Global,
  Inject,
  Logger,
  Module,
  type OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../config/configuration.js';
import { DATABASE } from './database.constants.js';
import { createDatabase } from './database.factory.js';
import type { DatabaseConnection } from './database.types.js';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      inject: [ConfigService],
      useFactory: async (config: ConfigService<AppConfig, true>) => {
        const options = config.get('database', { infer: true });
        const connection = await createDatabase(options);
        if (options.autoMigrate) {
          await connection.migrate();
        }
        new Logger('Database').log(`Connected to ${options.provider}`);
        return connection;
      },
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(
    @Inject(DATABASE) private readonly connection: DatabaseConnection,
  ) {}

  async onApplicationShutdown() {
    await this.connection.close();
  }
}
