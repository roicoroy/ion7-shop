import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pages',
    children: [
      {
        path: 'auth-home',
        loadComponent: () => import('./auth-home/auth-home.page').then(m => m.AuthHomePage)
      },
      {
        path: 'email',
        loadChildren: () => import('./email-flow/email-password.routes').then(m => m.routes)
      },
      {
        path: '',
        redirectTo: '/pages/auth-home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/pages/auth-home',
    pathMatch: 'full',
  },
];
