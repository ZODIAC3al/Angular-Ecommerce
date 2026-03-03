import { Routes } from '@angular/router';

import { Error } from './components/error/error';
import { adminGuard } from './Guards/admin-guard';
import { authGuard } from './Guards/auth-guard';
import { guestGuard } from './Guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/products').then((m) => m.Products),
  },
  {
    path: 'categories',
    loadComponent: () => import('./components/categories/categories').then((m) => m.Categories),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./components/profile/profile').then((m) => m.Profile),
  },
  {
    // Regular User Dashboard
    path: 'dashboard',
    canActivate: [authGuard],
    // 👇 Change this to a specific user dashboard component
    loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    // Strictly Admin Dashboard
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    // 👇 Create and load a separate admin-only component here
    loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./components/form/form').then((m) => m.Form),
  },
  {
    path: '**',
    component: Error,
  },
];
