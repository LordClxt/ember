import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastContainer } from '../../shared/components/toast-container/toast-container';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastContainer],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <a routerLink="/" class="brand">🔥 Ember</a>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }"
          >Home</a
        >
        <a routerLink="/items" routerLinkActive="active">Items</a>
      </nav>
    </header>
    <main><router-outlet /></main>
    <app-toast-container />
  `,
  styles: `
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      border-bottom: 1px solid var(--border);
    }
    .brand {
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--primary);
      text-decoration: none;
    }
    nav {
      display: flex;
      gap: 1rem;
    }
    nav a {
      color: inherit;
      text-decoration: none;
    }
    nav a.active {
      color: var(--primary);
      font-weight: 600;
    }
    main {
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem;
    }
  `,
})
export class Shell {}
