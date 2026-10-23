import { BadRequestException } from '@nestjs/common';
import { createItemSchema, paginationQuerySchema } from '@ember/contracts';
import { createZodDto } from '../utils/zod-dto.util.js';
import { ZodValidationPipe } from './zod-validation.pipe.js';

class CreateDto extends createZodDto(createItemSchema) {}
class QueryDto extends createZodDto(paginationQuerySchema) {}

describe('ZodValidationPipe', () => {
  const pipe = new ZodValidationPipe();

  it('returns the parsed value (trimmed, coerced, defaults applied)', () => {
    expect(
      pipe.transform({ name: '  a ' }, { type: 'body', metatype: CreateDto }),
    ).toEqual({ name: 'a' });
    expect(
      pipe.transform({ page: '3' }, { type: 'query', metatype: QueryDto }),
    ).toEqual({ page: 3, limit: 20 });
  });

  it('throws a 400 listing `field: reason`', () => {
    try {
      pipe.transform(
        { name: '', extra: 1 },
        { type: 'body', metatype: CreateDto },
      );
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const { message } = (error as BadRequestException).getResponse() as {
        message: string[];
      };
      expect(message.some((m) => m.startsWith('name: '))).toBe(true);
      expect(message.length).toBe(2);
    }
  });

  it('ignores parameters that are not zod DTOs', () => {
    expect(pipe.transform('raw', { type: 'param', metatype: String })).toBe(
      'raw',
    );
  });
});
