import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller.js';
import { ItemsService } from './items.service.js';
import { InMemoryItemsRepository } from './repositories/in-memory-items.repository.js';
import { ITEMS_REPOSITORY } from './repositories/items.repository.js';

@Module({
  controllers: [ItemsController],
  providers: [
    ItemsService,
    // Swap `useClass` for a Prisma/TypeORM implementation — nothing else changes.
    { provide: ITEMS_REPOSITORY, useClass: InMemoryItemsRepository },
  ],
  exports: [ItemsService],
})
export class ItemsModule {}
