import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MedusaCartFacade } from './medusa-cart.facade';
import { CartActions } from 'src/app/store/cart/cart.actions';

export interface ICartProductItem {
  quantity: any,
  variant: any,
  selectedProduct: any,
  thumbnail: any,
}

@Component({
  selector: 'app-medusa-cart',
  templateUrl: './medusa-cart.component.html',
  styleUrls: ['./medusa-cart.component.scss'],
})
export class MedusaCartComponent implements OnInit, AfterViewInit {
  viewState$: Observable<any>;

  cartForm: FormGroup | any;

  min = 1;
  max = 10;
  step = 1;
  counterValue: number | any;
  get counter() {
    return this.counterValue;
  }
  totalCheckout: any;
  user: any | null;
  userId: string | null = null;
  cartId: string | any;
  newCart: any;
  medusaCart: any;

  constructor(
    public navCtrl: NavController,
    private store: Store,
    private facade: MedusaCartFacade,
  ) {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe((state) => {
    //   console.log(state);
    // });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngAfterViewInit(): void {
  }
  incrementSelectItem(item: any) {
    this.store.dispatch(new CartActions.AddProductMedusaToCart(item.cart_id, 1, item.variant.id,));
  }
  decrementSelectItem(item: any) {
    return item?.quantity == 1 ?
      this.delete(item) :
      this.store.dispatch(new CartActions.AddProductMedusaToCart(item.cart_id, -1, item.variant.id));
  }
  delete(item: any) {
    this.store.dispatch(new CartActions.DeleteProductMedusaFromCart(item.cart_id, item.id));
  }
  goToCheckout() {
    this.navCtrl.navigateForward('checkout/pages/checkout-home');
    // console.log('goToCheckout');
  }
}
