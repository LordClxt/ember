import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemsStore } from './data/items.store';

@Component({
  selector: 'app-items-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>
      Items <small>({{ store.count() }})</small>
    </h1>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="name" placeholder="New item name" aria-label="Item name" />
      <button type="submit" [disabled]="form.invalid || store.loading()">Add</button>
    </form>

    @if (store.loading() && store.count() === 0) {
      <p>Loading…</p>
    } @else if (store.error()) {
      <p class="error">
        {{ store.error() }} <button type="button" (click)="store.load()">Retry</button>
      </p>
    } @else {
      <ul>
        @for (item of store.items(); track item.id) {
          <li>
            <span>{{ item.name }}</span>
            <button type="button" (click)="store.remove(item.id)" aria-label="Delete">✕</button>
          </li>
        } @empty {
          <li>No items yet. Add your first one!</li>
        }
      </ul>
    }
  `,
  styles: `
    form {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    input {
      flex: 1;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border);
    }
    .error {
      color: #c62828;
    }
  `,
})
export default class ItemsPage implements OnInit {
  protected readonly store = inject(ItemsStore);
  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
  });

  ngOnInit(): void {
    void this.store.load();
  }

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    await this.store.add(this.form.getRawValue());
    this.form.reset();
  }
}
