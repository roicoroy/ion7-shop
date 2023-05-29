import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/shared/types/models/User';
import { AuthState } from 'src/app/store/auth/auth.state';

export interface IHeaderFacadeState {
    isLoggedIn: boolean;
    user: IUser
}

@Injectable({
    providedIn: 'root'
})
export class HeaderFacade {

    @Select(AuthState.getUser) user$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    readonly viewState$: Observable<IHeaderFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.user$,
                this.isLoggedIn$,
            ]
        ).pipe(
            map((
                [
                    user,
                    isLoggedIn,]
            ) => ({
                user,
                isLoggedIn,
            }))
        );
    }
}
