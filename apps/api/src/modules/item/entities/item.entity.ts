import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { BaseEntity } from '../../../common/types/base-entity.type.js';

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
