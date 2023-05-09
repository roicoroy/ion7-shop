import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'start/tabs/home',
        pathMatch: 'full',
    },
    {
        path: 'start',
        loadChildren: () => import('./start/start.routes').then(m => m.routes)
      },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
    },
    {
        path: 'user',
        loadComponent: () => import('./start/profile/user/user.page').then(m => m.UserPage)
      },
      {
        path: 'orders',
        loadComponent: () => import('./start/profile/orders/orders.page').then(m => m.OrdersPage)
      },
      {
        path: 'addresses',
        loadComponent: () => import('./start/profile/addresses/addresses.page').then(m => m.AddressesPage)
      },
      {
        path: 'address-details',
        loadComponent: () => import('./start/profile/addresses/address-details/address-details.page').then(m => m.AddressDetailsPage)
      },
    {
        path: 'folder/:id',
        loadComponent: () =>
            import('./folder/folder.page').then((m) => m.FolderPage),
    },
];
