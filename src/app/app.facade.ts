import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from './store/auth/auth.state';
import { IUser } from './shared/types/models/User';

export interface IAppFacadeState {
    isLoggedIn: boolean;
    user: IUser;
}

@Injectable({
    providedIn: 'root'
})
export class AppFacade {

    @Select(AuthState.getUser) user$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;


    readonly viewState$: Observable<IAppFacadeState>;

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
