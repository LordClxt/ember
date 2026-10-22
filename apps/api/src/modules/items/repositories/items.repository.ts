import type { Repository } from '../../../common/repositories/repository.interface.js';
import type { CreateItemDto } from '../dto/create-item.dto.js';
import type { UpdateItemDto } from '../dto/update-item.dto.js';
import type { Item } from '../entities/item.entity.js';

/** Injection token: inject with `@Inject(ITEMS_REPOSITORY)`. */
export const ITEMS_REPOSITORY = Symbol('ITEMS_REPOSITORY');

export type ItemsRepository = Repository<Item, CreateItemDto, UpdateItemDto>;
