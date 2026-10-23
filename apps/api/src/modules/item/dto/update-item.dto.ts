import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { ITEM_NAME_MAX_LENGTH, type UpdateItemInput } from '@ember/contracts';
import { IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator';
import { CreateItemDto } from './create-item.dto.js';

export class UpdateItemDto
  extends PartialType(OmitType(CreateItemDto, ['name'] as const))
  implements UpdateItemInput
{
  /**
   * May be omitted but not nulled: `@IsOptional()` (added by `PartialType`)
   * would also let `null` through and break the `name: string` contract.
   */
  @ApiPropertyOptional({
    example: 'Renamed item',
    maxLength: ITEM_NAME_MAX_LENGTH,
  })
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  @MaxLength(ITEM_NAME_MAX_LENGTH)
  name?: string;
}
