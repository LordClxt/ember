import { plainToInstance } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
  validateSync,
} from 'class-validator';
import { DATABASE_PROVIDERS } from '../database/database.constants.js';
import type { DatabaseProvider } from '../database/database.types.js';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsOptional()
  CORS_ORIGINS?: string;

  @IsIn(DATABASE_PROVIDERS)
  @IsOptional()
  DB_PROVIDER: DatabaseProvider = 'sqlite';

  /** Optional for SQLite (defaults to a local file), required otherwise. */
  @ValidateIf((env: EnvironmentVariables) => env.DB_PROVIDER !== 'sqlite')
  @IsString()
  @IsNotEmpty()
  DATABASE_URL?: string;

  @IsBooleanString()
  @IsOptional()
  DB_AUTO_MIGRATE?: string;
}

/** Fails fast at boot if the environment is invalid. */
export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Invalid environment: ${errors.toString()}`);
  }
  return validated;
}
