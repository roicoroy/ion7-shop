import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { IRegisterAddress } from 'src/app/shared/types/types.interfaces';
import { AddressesFacade, IAddressesFacadeState } from './address.facade';
import { Store } from '@ngxs/store';
import { CustomerActions } from 'src/app/store/customer/customer.actions';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class AddressesPage implements OnInit, OnDestroy {

  private modalCtrl = inject(ModalController);
  private router = inject(Router);
  private facade = inject(AddressesFacade);
  private store = inject(Store);

  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<IAddressesFacadeState>;

  constructor() { }

  ngOnInit() {
    this.store.dispatch(new AddressesActions.GetRegionList());
    this.viewState$ = this.facade.viewState$;
    // this.viewState$
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((vs) => {
    //     console.log(vs);
    //     console.log(vs.customer?.shipping_addresses);
    //   });
  }
  addAddress() {
    this.router.navigate(['address-details'], { queryParams: { address: null } });
  }
  details(address: IRegisterAddress) {
    this.router.navigate(['address-details'], { queryParams: address });
  }

  delete(addressId: string) {
    this.store.dispatch(new CustomerActions.DeleteCustomerAddress(addressId));
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
