import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { Observable, Subject } from 'rxjs';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { IShippingFacadeState, ShippingFacade } from './shipping.facade';
import { ShippingActions } from 'src/app/store/shipping/shipping.actions';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipping',
  templateUrl: 'shipping.page.html',
  styleUrls: ['shipping.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    CustomComponentsModule
  ],
})
export class ShippingPage implements OnDestroy {

  private navigation = inject(NavigationService);
  private facade = inject(ShippingFacade);
  private store = inject(Store);
  private formBuilder = inject(FormBuilder);
  private readonly ngUnsubscribe = new Subject();

  shippingForm: FormGroup;

  viewState$: Observable<IShippingFacadeState>;

  constructor() {
    this.store.dispatch(new ShippingActions.GetShippingOptions());
    this.store.dispatch(new ShippingActions.ClearPaymentSession());
    this.viewState$ = this.facade.viewState$;
    // this.viewState$
    //   .subscribe((vs) => {
    //     console.log(vs);
    //   })
    this.shippingForm = this.formBuilder.group({
      shipping_method: new FormControl(''),
      provider_id: new FormControl(''),
    });
  }
  onAddShippingMethod(event$: any) {
    const shipping_option = event$.detail.value;
    if (shipping_option != null) {  
      this.store.dispatch(new ShippingActions.AddShippingMethod(shipping_option));
    }
  }
  onAddPymentSession($event: any) {
    const provider: string = $event.provider_id;
    this.store.dispatch(new ShippingActions.SetPaymentSession(provider));
  }
  next() {
    this.navigation.navControllerDefault('/checkout/pages/payment');
  }
  back() {
    this.navigation.navControllerDefault('checkout/pages/checkout-home');
  }
  logout() {
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
