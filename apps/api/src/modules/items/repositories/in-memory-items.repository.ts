import { Injectable } from '@nestjs/common';
import { InMemoryRepository } from '../../../common/repositories/in-memory.repository.js';
import type { CreateItemDto } from '../dto/create-item.dto.js';
import type { UpdateItemDto } from '../dto/update-item.dto.js';
import type { Item } from '../entities/item.entity.js';
import type { ItemsRepository } from './items.repository.js';

@Injectable()
export class InMemoryItemsRepository
  extends InMemoryRepository<Item, CreateItemDto, UpdateItemDto>
  implements ItemsRepository
{
  override create(input: CreateItemDto) {
    return this.insert({
      name: input.name,
      description: input.description ?? null,
    });
  }
}
