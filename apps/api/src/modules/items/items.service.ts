import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Paginated } from '../../common/interfaces/paginated.interface.js';
import type { CreateItemDto } from './dto/create-item.dto.js';
import type { UpdateItemDto } from './dto/update-item.dto.js';
import type { Item } from './entities/item.entity.js';
import {
  ITEMS_REPOSITORY,
  type ItemsRepository,
} from './repositories/items.repository.js';

/** Application service: orchestration + rules. Persistence goes through the repository. */
@Injectable()
export class ItemsService {
  constructor(
    @Inject(ITEMS_REPOSITORY) private readonly repository: ItemsRepository,
  ) {}

  async findAll(page: number, limit: number): Promise<Paginated<Item>> {
    const { items, meta } = await this.repository.findAll(page, limit);
    return { data: items, meta };
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.repository.findById(id);
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }

  create(dto: CreateItemDto): Promise<Item> {
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateItemDto): Promise<Item> {
    const item = await this.repository.update(id, dto);
    if (!item) throw new NotFoundException(`Item ${id} not found`);
    return item;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new NotFoundException(`Item ${id} not found`);
  }
}
