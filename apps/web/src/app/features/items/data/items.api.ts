import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/http/api.service';
import { Paginated } from '../../../core/models/paginated.model';
import { CreateItem, Item } from './item.model';

/** Data-access layer: one method per endpoint, no state. */
@Injectable({ providedIn: 'root' })
export class ItemsApi {
  private readonly api = inject(ApiService);

  list(page = 1, limit = 20): Observable<Paginated<Item>> {
    return this.api.get<Paginated<Item>>('items', { page, limit });
  }

  create(body: CreateItem): Observable<Item> {
    return this.api.post<Item>('items', body);
  }

  remove(id: string): Observable<void> {
    return this.api.delete(`items/${id}`);
  }
}
