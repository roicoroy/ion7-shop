import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { IRegisterAddress } from 'src/app/shared/types/types.interfaces';
import { Store } from '@ngxs/store';
import { CustomerActions } from 'src/app/store/customer/customer.actions';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { IOrderReviewFacadeState, OrderReviewFacade } from './order-review.facade';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.page.html',
  styleUrls: ['./order-review.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class OrderReviewPage implements OnInit, OnDestroy {

  private router = inject(Router);
  private facade = inject(OrderReviewFacade);
  private store = inject(Store);
  private navigation = inject(NavigationService);

  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<IOrderReviewFacadeState>;

  constructor() { }

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((vs) => {
        console.log(vs);
      });
  }
  details() {
  }
  next() {
    this.navigation.navControllerDefault('checkout/pages/checkout-home');
  }
  back() {
    this.navigation.navControllerDefault('checkout/pages/checkout-home');
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
