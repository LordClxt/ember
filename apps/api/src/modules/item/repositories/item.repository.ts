import type { Repository } from '../../../common/repositories/repository.interface.js';
import type { CreateItemDto } from '../dto/create-item.dto.js';
import type { UpdateItemDto } from '../dto/update-item.dto.js';
import type { Item } from '../entities/item.entity.js';

/** Injection token: inject with `@Inject(ITEM_REPOSITORY)`. */
export const ITEM_REPOSITORY = Symbol('ITEM_REPOSITORY');

export type ItemRepository = Repository<Item, CreateItemDto, UpdateItemDto>;
