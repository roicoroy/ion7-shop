import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest, map } from 'rxjs';
import { AuthState } from 'src/app/store/auth/auth.state';
import { CartState } from 'src/app/store/cart/cart.state';
import { ShippingState } from 'src/app/store/shipping/shipping.state';

export interface IPaymentFacadeState {
    secretKey: string,
    isLoggedIn: boolean,
    cart: any,
}

@Injectable({
    providedIn: 'root'
})
export class PaymentFacade {

    @Select(ShippingState.getSecretKey) secretKey$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    @Select(CartState.getCart) cart$: Observable<any>;

    readonly viewState$: Observable<IPaymentFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.secretKey$,
                this.isLoggedIn$,
                this.cart$,
            ]
        ).pipe(
            map(([
                secretKey,
                isLoggedIn,
                cart
            ]) => ({
                secretKey,
                isLoggedIn,
                cart
            }))
        );
    }
}
