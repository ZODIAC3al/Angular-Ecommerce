import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guards';
import { adminGuard } from './services/auth.guards';

export const routes: Routes = [
  // Public
  { path: '',        redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth',    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent) },

  // User dashboard — any logged-in user
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },

  // Admin dashboard — admin role ONLY
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./admin/users/admin-users.component').then(m => m.AdminUsersComponent),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: 'auth' },
];
