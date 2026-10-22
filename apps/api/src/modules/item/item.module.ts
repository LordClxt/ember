import { Module } from '@nestjs/common';
import { ItemController } from './item.controller.js';
import { ItemService } from './item.service.js';
import { DrizzleItemRepository } from './repositories/drizzle-item.repository.js';
import { ITEM_REPOSITORY } from './repositories/item.repository.js';

@Module({
  controllers: [ItemController],
  providers: [
    ItemService,
    // The service depends on the token, not on Drizzle.
    { provide: ITEM_REPOSITORY, useClass: DrizzleItemRepository },
  ],
  exports: [ItemService],
})
export class ItemModule {}
