import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type { PaginationQuery } from '@ember/contracts';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto implements PaginationQuery {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 20;
}
