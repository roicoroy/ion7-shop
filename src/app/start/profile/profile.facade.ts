import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/shared/types/models/User';
import { AuthState } from 'src/app/store/auth/auth.state';

export interface IProfileFacadeState {
    customer: any,
    isLoggedIn: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class ProfileFacade {

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    private store = inject(Store);

    readonly viewState$: Observable<IProfileFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.customer$,
                this.isLoggedIn$,
            ]
        ).pipe(
            map((
                [
                    customer,
                    isLoggedIn,
                ]
            ) => ({
                customer,
                isLoggedIn,
            }))
        );
    }
}
