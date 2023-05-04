import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartState } from 'src/app/store/cart/cart.state';
// import { CartState } from 'src/app/store/cart/cart.state';
// import { MedusaState } from 'src/app/store/medusa/medusa.state';

@Injectable({
    providedIn: 'root'
})
export class MedusaCartFacade {

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
