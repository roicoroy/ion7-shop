import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressesState } from 'src/app/store/addresses/addresses.state';
import { AuthState } from 'src/app/store/auth/auth.state';
import { CartState } from 'src/app/store/cart/cart.state';

export interface ICartAddressesFacadeState {
    customer: any,
    regionList: any,
    countryList: any,
    cart: any,
    session: any,
}

@Injectable({
    providedIn: 'root'
})
export class CartAddressesFacade {

    @Select(CartState.getCart) cart$: Observable<any>;

    @Select(AuthState.getSession) session$: Observable<any>;

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AddressesState.getRegionList) regionList$: Observable<any>;

    @Select(AddressesState.getCountryList) countryList$: Observable<any>;

    readonly viewState$: Observable<ICartAddressesFacadeState>;

    constructor(
    ) {
        this.viewState$ = combineLatest(
            [
                this.cart$,
                this.session$,
                this.customer$,
                this.regionList$,
                this.countryList$,
            ]
        ).pipe(
            map((
                [
                    cart,
                    session,
                    customer,
                    regionList,
                    countryList,
                ]
            ) => ({
                cart,
                session,
                customer,
                regionList,
                countryList,
            }))
        );
    }
}
