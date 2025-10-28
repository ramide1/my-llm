import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'chats',
    pathMatch: 'full',
  },
  {
    path: 'chats',
    loadComponent: () => import('./chats/chats.page').then(m => m.ChatsPage)
  },
  {
    path: 'chats/:id',
    loadComponent: () => import('./chats/chats.page').then(m => m.ChatsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then(m => m.SettingsPage)
  }
];