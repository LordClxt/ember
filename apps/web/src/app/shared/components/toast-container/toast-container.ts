import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" aria-live="polite">
      @for (toast of notifications.notifications(); track toast.id) {
        <button type="button" class="toast" [class]="toast.kind" (click)="notifications.dismiss(toast.id)">
          {{ toast.message }}
        </button>
      }
    </div>
  `,
  styles: `
    .toasts { position: fixed; bottom: 1rem; right: 1rem; display: grid; gap: .5rem; z-index: 10; }
    .toast { border: 0; border-radius: .5rem; padding: .75rem 1rem; color: #fff; cursor: pointer; text-align: left; }
    .success { background: #2e7d32; }
    .error { background: #c62828; }
    .info { background: #29335c; }
  `,
})
export class ToastContainer {
  protected readonly notifications = inject(NotificationService);
}
