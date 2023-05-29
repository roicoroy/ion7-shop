import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { CartReviewFacade, ICartReviewFacadeState } from './cart-review.facade';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-cart-review',
  templateUrl: './cart-review.page.html',
  styleUrls: ['./cart-review.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CartPage implements OnInit, OnDestroy {

  private router = inject(Router);
  private facade = inject(CartReviewFacade);
  private store = inject(Store);
  private navigation = inject(NavigationService);

  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<ICartReviewFacadeState>;

  constructor() { }

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$
      // .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((vs) => {
    //     console.log(vs);
    //   });
  }
  details() {
  }
  delete(item: any) {
    this.store.dispatch(new CartActions.DeleteProductMedusaFromCart(item.cart_id, item.id));
  }
  incrementSelectItem(item: any) {
    this.store.dispatch(new CartActions.AddProductMedusaToCart(item.cart_id, 1, item.variant.id,));
  }
  decrementSelectItem(item: any) {
    return item?.quantity == 1 ?
      this.delete(item) :
      this.store.dispatch(new CartActions.AddProductMedusaToCart(item.cart_id, -1, item.variant.id));
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
