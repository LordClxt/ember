import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { BaseEntity } from '../../../common/repositories/in-memory.repository.js';

export class Item implements BaseEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'My first item' })
  name: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
