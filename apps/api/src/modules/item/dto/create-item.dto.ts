import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CreateItemInput } from '@ember/contracts';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateItemDto implements CreateItemInput {
  @ApiProperty({ example: 'My first item', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ maxLength: 500 })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
