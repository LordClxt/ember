import { updateItemSchema } from '@ember/contracts';
import { createZodDto } from '../../../common/utils/zod-dto.util.js';

export class UpdateItemDto extends createZodDto(updateItemSchema) {}
