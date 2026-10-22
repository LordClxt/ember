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
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator.js';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto.js';
import { CreateItemDto } from './dto/create-item.dto.js';
import { UpdateItemDto } from './dto/update-item.dto.js';
import { Item } from './entities/item.entity.js';
import { ItemService } from './item.service.js';

/** Thin HTTP layer: validation via DTOs, logic in ItemService. */
@ApiTags('items')
@Controller({ path: 'items', version: '1' })
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  @ApiPaginatedResponse(Item)
  findAll(@Query() { page, limit }: PaginationQueryDto) {
    return this.itemService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOkResponse({ type: Item })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.itemService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ type: Item })
  create(@Body() dto: CreateItemDto) {
    return this.itemService.create(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Item })
  @ApiNotFoundResponse()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateItemDto) {
    return this.itemService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.itemService.remove(id);
  }
}
