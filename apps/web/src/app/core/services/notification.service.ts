import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  kind: NotificationKind;
  message: string;
}

/** Signal-based toast queue, rendered by <app-toast-container>. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 0;
  private readonly _notifications = signal<Notification[]>([]);
  readonly notifications = this._notifications.asReadonly();

  success(message: string) {
    this.push('success', message);
  }

  error(message: string) {
    this.push('error', message);
  }

  info(message: string) {
    this.push('info', message);
  }

  dismiss(id: number) {
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }

  private push(kind: NotificationKind, message: string, durationMs = 4000) {
    const id = this.nextId++;
    this._notifications.update((list) => [...list, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }
}
