import { Routes } from '@angular/router';
import { StartPage } from './start.page';
import { StartResolver } from './start.resolver';

export const routes: Routes = [
  {
    path: 'tabs',
    component: StartPage,
    resolve: { StartResolver },
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },    
];
