import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';

/** Every feature is lazy-loaded. */
export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', loadComponent: () => import('./features/home/home.page') },
      { path: 'items', loadChildren: () => import('./features/items/items.routes') },
    ],
  },
  { path: '**', redirectTo: '' },
];
