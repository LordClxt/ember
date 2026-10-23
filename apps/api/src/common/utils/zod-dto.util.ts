import { z } from 'zod';

type SchemaObject = Record<string, unknown> & {
  properties?: Record<string, Record<string, unknown>>;
  required?: string[];
};

export interface ZodDtoClass<T extends z.ZodType = z.ZodType> {
  new (): z.output<T>;
  readonly schema: T;
}

/**
 * Turns a schema from `@ember/contracts` into a class Nest can use as a DTO:
 * `ZodValidationPipe` validates with `schema`, and `@nestjs/swagger` reads the
 * properties from `_OPENAPI_METADATA_FACTORY` (the hook its CLI plugin uses).
 * Fields are never redeclared: the contract is the single source of truth.
 *
 * `io: 'input'` documents what clients send (defaults optional), `'output'` what they receive.
 */
export function createZodDto<T extends z.ZodType>(
  schema: T,
  io: 'input' | 'output' = 'input',
): ZodDtoClass<T> {
  class ZodDto {
    static readonly schema = schema;

    static _OPENAPI_METADATA_FACTORY() {
      return toSwaggerProperties(
        z.toJSONSchema(schema, { target: 'openapi-3.0', io }) as SchemaObject,
      );
    }
  }
  return ZodDto as unknown as ZodDtoClass<T>;
}

/** Duck-typed so it still works if two copies of zod end up installed. */
export function isZodDtoClass(value: unknown): value is ZodDtoClass {
  return (
    typeof value === 'function' &&
    'schema' in value &&
    typeof (value.schema as { safeParse?: unknown } | undefined)?.safeParse ===
      'function'
  );
}

function toSwaggerProperties({ properties = {}, required = [] }: SchemaObject) {
  return Object.fromEntries(
    Object.entries(properties).map(
      ([key, { pattern, maximum, ...property }]) => [
        key,
        {
          ...property,
          // The generated regexes duplicate `format` (uuid, date-time) and clutter the docs.
          ...(pattern !== undefined && !property.format && { pattern }),
          ...(maximum !== Number.MAX_SAFE_INTEGER &&
            maximum !== undefined && { maximum }),
          required: required.includes(key),
        },
      ],
    ),
  );
}
