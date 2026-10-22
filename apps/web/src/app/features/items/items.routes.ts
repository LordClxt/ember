import { Routes } from '@angular/router';
import { ItemsStore } from './data/items.store';

export default [
  {
    path: '',
    providers: [ItemsStore],
    loadComponent: () => import('./items.page'),
  },
] satisfies Routes;
