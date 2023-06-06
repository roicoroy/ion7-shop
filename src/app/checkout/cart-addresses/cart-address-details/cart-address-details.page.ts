import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { IRegisterAddress } from 'src/app/shared/types/types.interfaces';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { CountryPhone } from 'src/app/shared/types/models/country-phone.model';
import { NgxsModule, Store } from '@ngxs/store';
import { AddressesActions } from 'src/app/store/addresses/addresses.actions';
import { fade } from 'src/app/shared/animations/animations';
import { NgxsFormPluginModule, UpdateFormValue } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { CustomerActions } from 'src/app/store/customer/customer.actions';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { CartAddressesFacade, ICartAddressesFacadeState } from '../cart-addresses.facade';

@Component({
  selector: 'app-cart-address-details',
  templateUrl: './cart-address-details.page.html',
  styleUrls: ['./cart-address-details.page.scss'],
  standalone: true,
  animations: [
    fade()
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    ReactiveFormsModule
  ]
})
export class AddressDetailsPage implements OnInit, OnDestroy {

  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private facade = inject(CartAddressesFacade);
  private store = inject(Store);
  private navigation = inject(NavigationService);

  cartAdressDetailsForm: FormGroup;

  address: IRegisterAddress;

  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<ICartAddressesFacadeState>;

  validation_messages = {
    'first_name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'last_name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'address_1': [
      { type: 'required', message: 'Name is required.' }
    ],
    'address_2': [
      { type: 'required', message: 'Name is required.' }
    ],
    'region_code': [
      { type: 'required', message: 'Name is required.' }
    ],
    'country': [
      { type: 'required', message: 'Name is required.' }
    ],
    'city': [
      { type: 'required', message: 'Name is required.' }
    ],
    'postal_code': [
      { type: 'required', message: 'Name is required.' }
    ],
    'phone': [
      { type: 'required', message: 'Name is required.' }
    ],

  };

  phoneNumberPlaceholder: string;
  isNewAddress: boolean = null;
  initialAddressesArrayLength: number = null;
  constructor() {

    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe((vs) => {
    //   // console.log(vs.customer.shipping_addresses.length);
    //   this.initialAddressesArrayLength = vs.customer.shipping_addresses.length;
    //   console.log(this.initialAddressesArrayLength);
    // });

    this.cartAdressDetailsForm = this.formBuilder.group({
      id: new FormControl('ID211232323'),
      first_name: new FormControl('Ric', Validators.required),
      last_name: new FormControl('Watanabe', Validators.required),
      address_1: new FormControl('24/45', Validators.required),
      address_2: new FormControl('Haven Place', Validators.required),
      region_code: new FormControl(''),
      country: new FormControl(''),
      city: new FormControl('Gapira', Validators.required),
      postal_code: new FormControl('ED00OK', Validators.required),
      phone: new FormControl('433434343', Validators.compose([
        Validators.required,
      ])),
    });
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        takeUntil(this.ngUnsubscribe),
        take(1),
      )
      .subscribe((address: IRegisterAddress) => {
        console.log(address.address_1);
        if (address.address_1 && address.address_2) {
          this.isNewAddress = false;
          this.populateEditForm(address);
        }
        if (!address.address_1 && !address.address_1) {
          console.log(this.isNewAddress);
          this.isNewAddress = true;
        }
      }
      )
  }
  async populateEditForm(address: IRegisterAddress) {
    // console.log(address);
    const regionList = this.store.selectSnapshot<any>((state) => state.addresses.regionList);
    const region_code = buildRegionCode(address?.country_code, regionList);
    this.store.dispatch([
      new UpdateFormValue({
        path: 'addresses.cartAdressDetailsForm',
        value: {
          id: address?.id,
          first_name: address?.first_name,
          last_name: address.last_name,
          address_1: address.address_1,
          address_2: address.address_2,
          region_code: region_code,
          country: address.country_code,
          city: address.city,
          postal_code: address.postal_code,
          phone: address.phone,
        },
      }),
    ]);
  }
  saveEditedAddress() {
    // console.log(this.adressDetailsForm);
    const address: IRegisterAddress = {
      first_name: this.cartAdressDetailsForm.get('first_name').value,
      last_name: this.cartAdressDetailsForm.get('last_name').value,
      address_1: this.cartAdressDetailsForm.get('address_1').value,
      address_2: this.cartAdressDetailsForm.get('address_2').value,
      region_code: this.cartAdressDetailsForm.get('region_code').value,
      country_code: this.cartAdressDetailsForm.get('country').value,
      city: this.cartAdressDetailsForm.get('city').value,
      postal_code: this.cartAdressDetailsForm.get('postal_code').value,
      phone: this.cartAdressDetailsForm.get('phone').value,
    };
    if (this.cartAdressDetailsForm.valid) {
      this.store.dispatch(new CustomerActions.UpdateCustomerAddress(this.cartAdressDetailsForm.get('id').value, address));
      this.navigation.navControllerDefault('checkout/pages/cart-addresses');
    }
  }
  saveNewAddress() {
    const address: IRegisterAddress = {
      first_name: this.cartAdressDetailsForm.get('first_name').value,
      last_name: this.cartAdressDetailsForm.get('last_name').value,
      address_1: this.cartAdressDetailsForm.get('address_1').value,
      address_2: this.cartAdressDetailsForm.get('address_2').value,
      region_code: this.cartAdressDetailsForm.get('region_code').value,
      country_code: this.cartAdressDetailsForm.get('country').value,
      city: this.cartAdressDetailsForm.get('city').value,
      postal_code: this.cartAdressDetailsForm.get('postal_code').value,
      phone: this.cartAdressDetailsForm.get('phone').value,
    };
    if (this.cartAdressDetailsForm.valid) {
      this.store.dispatch(new CustomerActions.AddAShippingAddress(address));
      this.navigation.navControllerDefault('checkout/pages/cart-addresses');
    }
  }
  onRegionCodeChange(regionId?: string) {
    this.store.dispatch(new AddressesActions.GetCountries(regionId));
  }
  onCountryChange(country: any) {
    this.phoneNumberPlaceholder = this.buildPhoneNumberPlaceholder(country);
  }
  buildPhoneNumberPlaceholder(country: any): string {
    const string = new CountryPhone(country.iso_2, country.name);
    const phoneNumberPlaceholder = `${string.code} ${string.sample_phone}`;
    return phoneNumberPlaceholder;
  }
  addAddress() {
    this.navigation.navControllerDefault('/checkout/pages/cart-addresses');
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}

export function buildRegionCode(country_code: string, regionList: any) {
  if (regionList != null) {
    const countries = regionList.map((region: any, i: any) => region.countries);
    const result = [].concat(...countries);
    const filtered = result.filter((region: any) => {
      return region.iso_2 === country_code;
    });
    return filtered[0]?.region_id;
  }
}