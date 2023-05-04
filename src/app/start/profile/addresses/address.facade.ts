import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressesState } from 'src/app/store/addresses/addresses.state';
import { AuthState } from 'src/app/store/auth/auth.state';

export interface IAddressesFacadeState {
    customer: any,
    regionList: any,
    countryList: any,
}

@Injectable({
    providedIn: 'root'
})
export class AddressesFacade {

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AddressesState.getRegionList) regionList$: Observable<any>;

    @Select(AddressesState.getCountryList) countryList$: Observable<any>;

    readonly viewState$: Observable<IAddressesFacadeState>;

    constructor(
    ) {
        this.viewState$ = combineLatest(
            [
                this.customer$,
                this.regionList$,
                this.countryList$,
            ]
        ).pipe(
            map((
                [
                    customer,
                    regionList,
                    countryList,
                ]
            ) => ({
                customer,
                regionList,
                countryList,
            }))
        );
    }
}
