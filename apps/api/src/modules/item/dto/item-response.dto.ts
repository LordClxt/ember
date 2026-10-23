import { itemSchema } from '@ember/contracts';
import { createZodDto } from '../../../common/utils/zod-dto.util.js';

/** Swagger model of the JSON returned for an item. */
export class ItemResponseDto extends createZodDto(itemSchema, 'output') {}
