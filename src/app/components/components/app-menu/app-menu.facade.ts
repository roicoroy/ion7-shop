import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest, map } from 'rxjs';
import { CartState } from 'src/app/store/cart/cart.state';

@Injectable({
    providedIn: 'root'
})
export class AppMenuFacade {

    @Select(CartState.getCart) getCart$: Observable<any>;
    @Select(CartState.getCartId) getCartId$: Observable<any>;

    readonly viewState$: Observable<any>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.getCart$,
                this.getCartId$,
            ]
        ).pipe(
            map((
                [
                    cart,
                    cartId
                ]
            ) => ({
                cart,
                cartId
            }))
        );
    }
}
