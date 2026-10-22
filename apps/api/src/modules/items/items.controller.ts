import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { CreateItemDto } from './dto/create-item.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';
import { Item } from './entities/item.entity.js';
import { ItemsService } from './items.service.js';

/** Thin HTTP layer: validation via DTOs, logic in ItemsService. */
@ApiTags('items')
@Controller({ path: 'items', version: '1' })
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query() { page, limit }: PaginationQueryDto) {
    return this.itemsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOkResponse({ type: Item })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.itemsService.findOne(id);
  }

  @Post()
  @ApiOkResponse({ type: Item })
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Item })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.itemsService.remove(id);
  }
}
