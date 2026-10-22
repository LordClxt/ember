import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { CreateItem, Item } from './item.model';
import { ItemsApi } from './items.api';

/**
 * Signal store (facade) pattern: components read signals and call methods;
 * they never talk to the API directly. Provided at route level, so state
 * lives as long as the feature is displayed.
 */
@Injectable()
export class ItemsStore {
  private readonly api = inject(ItemsApi);
  private readonly notifications = inject(NotificationService);

  private readonly _items = signal<Item[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._items().length);

  async load(): Promise<void> {
    await this.run(async () => {
      const page = await firstValueFrom(this.api.list());
      this._items.set(page.data);
    });
  }

  async add(input: CreateItem): Promise<void> {
    await this.run(async () => {
      const item = await firstValueFrom(this.api.create(input));
      this._items.update((items) => [...items, item]);
      this.notifications.success(`"${item.name}" created`);
    });
  }

  async remove(id: string): Promise<void> {
    await this.run(async () => {
      await firstValueFrom(this.api.remove(id));
      this._items.update((items) => items.filter((i) => i.id !== id));
    });
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await action();
    } catch {
      // The HTTP error interceptor already notified the user.
      this._error.set('Something went wrong.');
    } finally {
      this._loading.set(false);
    }
  }
}
