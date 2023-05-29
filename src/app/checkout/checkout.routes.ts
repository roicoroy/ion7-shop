import { Routes } from '@angular/router';
import { CheckoutResolver } from './checkout.resolver';

export const routes: Routes = [
  {
    path: 'pages',
    // component: ShopPage,
    children: [
      {
        path: 'checkout-home',
        loadComponent: () => import('./checkout-home/checkout-home.page').then(m => m.CheckoutHomePage)
      },
      {
        path: 'cart-addresses',
        loadComponent: () => import('./cart-addresses/cart-addresses.page').then(m => m.CartAddressesPage)
      },
      {
        path: 'cart-review',
        loadComponent: () => import('./cart-review/cart-review.page').then(m => m.CartPage)
      },
      {
        path: 'order-review',
        loadComponent: () => import('./order-review/order-review.page').then(m => m.OrderReviewPage)
      },
      {
        path: 'shipping',
        loadComponent: () => import('./shipping/shipping.page').then(m => m.ShippingPage)
      },
      {
        path: 'payment',
        loadComponent: () => import('./payment/payment.page').then(m => m.PaymentPage)
      },
      {
        path: 'cart-address-details',
        loadComponent: () => import('./cart-addresses/cart-address-details/cart-address-details.page').then(m => m.AddressDetailsPage)
      },
      {
        path: '',
        redirectTo: '/pages/checkout-home',
        pathMatch: 'full',
      },
    ],
    resolve: { CheckoutResolver }
  },
  {
    path: '',
    redirectTo: '/pages/checkout-home',
    pathMatch: 'full',
  },
];
