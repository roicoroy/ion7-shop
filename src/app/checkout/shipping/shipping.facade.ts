import { Injectable, OnDestroy, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, map, take, takeUntil } from 'rxjs';
import { CartState } from 'src/app/store/cart/cart.state';
import { ShippingState } from 'src/app/store/shipping/shipping.state';
import { AuthState } from 'src/app/store/auth/auth.state';
import { ShippingActions } from 'src/app/store/shipping/shipping.actions';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';

export interface IShippingFacadeState {
    shippingOptions: any,
    paymentSessions: any[],
    isLoggedIn: any,
    cart: any,
}

@Injectable({
    providedIn: 'root'
})
export class ShippingFacade implements OnDestroy {

    @Select(ShippingState.getShippingOptions) shippingOptions$: Observable<any>;

    @Select(ShippingState.getPaymentSessions) paymentSessions$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    @Select(CartState.getCart) cart$: Observable<any>;

    readonly viewState$: Observable<IShippingFacadeState>;

    private store = inject(Store);
    private utility = inject(UtilityService);

    private readonly ngUnsubscribe = new Subject();

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.shippingOptions$,
                this.paymentSessions$,
                this.isLoggedIn$,
                this.cart$,
            ]
        ).pipe(
            map(([
                shippingOptions,
                paymentSessions,
                isLoggedIn,
                cart
            ]) => ({
                shippingOptions,
                paymentSessions,
                isLoggedIn,
                cart
            }))
        );
        // this.viewState$
        //     .pipe(
        //         takeUntil(this.ngUnsubscribe),
        //         // take(1)
        //     )
        //     .subscribe((vs) => {
        //         console.log('shipping page vs:', vs);
        //         if (vs.cart != null) {
        //             this.store.dispatch(new ShippingActions.GetShippingOptions(vs.cart.id));
        //         } else {
        //             this.utility.presentAlert('Need to create a cart, please');
        //         }
        //     });
    }
    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}
