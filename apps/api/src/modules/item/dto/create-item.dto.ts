import { createItemSchema } from '@ember/contracts';
import { createZodDto } from '../../../common/utils/zod-dto.util.js';

export class CreateItemDto extends createZodDto(createItemSchema) {}
