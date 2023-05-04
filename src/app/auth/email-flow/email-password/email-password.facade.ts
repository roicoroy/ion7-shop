import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../../../store/auth/auth.state';

export interface IEmailPasswordFacadeState {
    isLoggedIn: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class EmailPasswordFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    readonly viewState$: Observable<IEmailPasswordFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
            ]
        ).pipe(
            map(([
                isLoggedIn,
            ]) => ({
                isLoggedIn,
            }))
        );
    }
}
