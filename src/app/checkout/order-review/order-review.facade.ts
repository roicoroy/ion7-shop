import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest, map } from 'rxjs';
import { CartState } from 'src/app/store/cart/cart.state';

export interface IOrderReviewFacadeState {
    recentCompletedOrder: any,
}

@Injectable({
    providedIn: 'root'
})
export class OrderReviewFacade {

    @Select(CartState.getRecentCompletedOrder) recentCompletedOrder$: Observable<any>;

    readonly viewState$: Observable<IOrderReviewFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.recentCompletedOrder$,
            ]
        ).pipe(
            map(([
                recentCompletedOrder,
            ]) => ({
                recentCompletedOrder,
            }))
        );
    }
}
