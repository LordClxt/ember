import {
  type ArgumentMetadata,
  BadRequestException,
  Injectable,
  type PipeTransform,
} from '@nestjs/common';
import { isZodDtoClass } from '../utils/zod-dto.util.js';

/**
 * Validates and transforms every `@Body()` / `@Query()` / `@Param()` typed with a
 * DTO built by `createZodDto`. Other parameters pass through untouched.
 * Errors keep the API's error format: `message` is a list of `field: reason`.
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (!isZodDtoClass(metatype)) return value;
    const result = metatype.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(
        result.error.issues.map(({ path, message }) =>
          path.length > 0 ? `${path.join('.')}: ${message}` : message,
        ),
      );
    }
    return result.data;
  }
}
