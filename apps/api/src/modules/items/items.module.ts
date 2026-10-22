import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller.js';
import { ItemsService } from './items.service.js';
import { DrizzleItemsRepository } from './repositories/drizzle-items.repository.js';
import { ITEMS_REPOSITORY } from './repositories/items.repository.js';

@Module({
  controllers: [ItemsController],
  providers: [
    ItemsService,
    // The service depends on the token, not on Drizzle.
    { provide: ITEMS_REPOSITORY, useClass: DrizzleItemsRepository },
  ],
  exports: [ItemsService],
})
export class ItemsModule {}
