import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { Observable, Subject } from 'rxjs';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { CheckoutFacade, ICheckoutFacadeState } from '../checkout.facade';

@Component({
  selector: 'app-checkout-home',
  templateUrl: 'checkout-home.page.html',
  styleUrls: ['checkout-home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    CustomComponentsModule
  ],
})
export class CheckoutHomePage implements OnDestroy {

  private navigation = inject(NavigationService);
  private facade = inject(CheckoutFacade);
  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<ICheckoutFacadeState>;

  constructor() {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe((vs) => {
    //   console.log(vs);
    // });
  }
  loginPages() {
    this.navigation.navControllerDefault('/auth/pages/auth-home');
  }
  homePage() {
    this.navigation.navControllerDefault('/start/tabs/home');
  }
  cartAddresses() {
    this.navigation.navControllerDefault('/checkout/pages/cart-addresses');
  }
  cartReviewPage() {
    this.navigation.navControllerDefault('/checkout/pages/cart-review');
  }
  orderReviewPage() {
    this.navigation.navControllerDefault('/checkout/pages/order-review');
  }
  shippingPage() {
    this.navigation.navControllerDefault('/checkout/pages/shipping');
  }
  paymentPage() {
    this.navigation.navControllerDefault('/checkout/pages/payment');
  }
  logout() {
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
