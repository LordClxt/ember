import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { CreateItemDto } from './create-item.dto.js';

export class UpdateItemDto extends PartialType(
  OmitType(CreateItemDto, ['name'] as const),
) {
  /**
   * May be omitted but not nulled: `@IsOptional()` (added by `PartialType`)
   * would also let `null` through and break the `name: string` contract.
   */
  @ApiPropertyOptional({ example: 'Renamed item', maxLength: 120 })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name?: string;
}
