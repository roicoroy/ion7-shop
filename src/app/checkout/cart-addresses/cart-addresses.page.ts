import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { IRegisterAddress } from 'src/app/shared/types/types.interfaces';
import { CartAddressesFacade, ICartAddressesFacadeState } from './cart-addresses.facade';
import { Store } from '@ngxs/store';
import { CustomerActions } from 'src/app/store/customer/customer.actions';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

@Component({
  selector: 'app-cart-addresses',
  templateUrl: './cart-addresses.page.html',
  styleUrls: ['./cart-addresses.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CartAddressesPage implements OnInit, OnDestroy {

  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private facade = inject(CartAddressesFacade);
  private store = inject(Store);
  private navigation = inject(NavigationService);

  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<ICartAddressesFacadeState>;

  constructor() { }

  ngOnInit() {
    this.store.dispatch(new AddressesActions.GetRegionList());
    this.viewState$ = this.facade.viewState$;
    this.viewState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((vs) => {        
        // console.log(vs.cart?.billing_address?.id);
        // console.log(vs.cart?.shipping_address?.id);
        // console.log(vs?.session);
        // // console.log(vs.customer.shipping_addresses);
        // vs.session?.shipping_addresses.forEach((address: any) => {
        //   console.log(address?.id);
        // });
        // vs.customer?.shipping_addresses.forEach((address: any) => {
        //   console.log(address?.id);
        // });
      });
  }
  addAddress() {
    this.router.navigate(['checkout/pages/cart-address-details'], { queryParams: { address: null } });
  }
  async useBillingAddress(address: IRegisterAddress) {
    const cartId = await this.store.selectSnapshot<any>((state: any) => state.cart.cart?.id);
    this.store.dispatch(new CartActions.UpdateCartBillingAddress(cartId, address));
    // this.store.dispatch(new CustomerActions.AddAShippingAddress(address));
  }
  async useShippingAddress(address: IRegisterAddress) {
    const cartId = await this.store.selectSnapshot<any>((state: any) => state.cart.cart?.id);
    this.store.dispatch(new CartActions.UpdateCartShippingAddress(cartId, address));
    // this.store.dispatch(new CustomerActions.AddAShippingAddress(address));
  }
  details(address: IRegisterAddress) {
    console.log(address);
    this.router.navigate(['checkout/pages/cart-address-details'], { queryParams: address });
  }
  async delete(addressId: string) {
    this.store.dispatch(new CustomerActions.DeleteCustomerAddress(addressId));
  }
  next() {
    this.navigation.navControllerDefault('checkout/pages/checkout-home');
  }
  back() {
    this.navigation.navControllerDefault('checkout/pages/checkout-home');
  }
  buildRegionCode(country_code: string) {
    const regionList = this.store.selectSnapshot<any>((state) => state.addresses.regionList);
    if (regionList != null) {
      const countries = regionList.map((region: any, i: any) => region.countries);
      const result = [].concat(...countries);
      const filtered = result.filter((region: any) => {
        return region.iso_2 === country_code;
      });
      return filtered[0]?.name;
    }
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
