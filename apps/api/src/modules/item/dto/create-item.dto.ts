import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  type CreateItemInput,
  ITEM_DESCRIPTION_MAX_LENGTH,
  ITEM_NAME_MAX_LENGTH,
} from '@ember/contracts';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateItemDto implements CreateItemInput {
  @ApiProperty({ example: 'My first item', maxLength: ITEM_NAME_MAX_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(ITEM_NAME_MAX_LENGTH)
  name: string;

  @ApiPropertyOptional({ maxLength: ITEM_DESCRIPTION_MAX_LENGTH })
  @IsString()
  @IsOptional()
  @MaxLength(ITEM_DESCRIPTION_MAX_LENGTH)
  description?: string;
}
