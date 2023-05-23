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
        path: 'register',
        loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
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
