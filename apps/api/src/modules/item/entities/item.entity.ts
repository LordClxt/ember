import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Item as ItemContract } from '@ember/contracts';
import type { BaseEntity } from '../../../common/types/base-entity.type.js';
import type {
  AssertTrue,
  SerializedAs,
} from '../../../common/types/serialized.type.js';

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

/** Fails to compile if the JSON of `Item` drifts from the shared contract. */
export type ItemMatchesContract = AssertTrue<SerializedAs<Item, ItemContract>>;
