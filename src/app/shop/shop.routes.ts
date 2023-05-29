import { Routes } from '@angular/router';
import { ShopPage } from './shop.page';
import { ShopResolver } from './shop.resolver';

export const routes: Routes = [
  {
    path: 'tabs',
    // component: ShopPage,
    children: [
      {
        path: 'products-list',
        loadComponent: () => import('./products-list/products-list.page').then(m => m.ProductsListPage)
      },
      // {
      //   path: 'customer',
      //   loadComponent: () => import('../start/profile/customer/customer.page').then(m => m.CustomerPage)
      // },
      {
        path: '',
        redirectTo: '/tabs/product-list',
        pathMatch: 'full',
      },
    ],
    resolve: { ShopResolver }
  },
  {
    path: '',
    redirectTo: '/tabs/product-list',
    pathMatch: 'full',
  },
];
