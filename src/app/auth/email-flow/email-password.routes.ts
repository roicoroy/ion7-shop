import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'flow',
    children: [
      {
        path: 'email-password',
        loadComponent: () => import('./email-password/email-password.page').then(m => m.EmailPasswordPage)
      },
      {
        path: '',
        redirectTo: '/email/email-password',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/email/email-password',
    pathMatch: 'full',
  },
];
