import { paginationQuerySchema } from '@ember/contracts';
import { createZodDto } from '../utils/zod-dto.util.js';

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
