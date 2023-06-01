import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/shared/types/models/User';
import { AuthStateActions } from 'src/app/store/auth/auth.actions';
import { AuthState } from 'src/app/store/auth/auth.state';
import { UserProfileActions } from 'src/app/store/user-profile/user-profile.actions';

export interface IProfileFacadeState {
    customer: any,
    isLoggedIn: boolean,
}

@Injectable({
    providedIn: 'root'
})
export class ProfileFacade {

    // @Select(AuthState.getSession) session$: Observable<any>;

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    private store = inject(Store);

    readonly viewState$: Observable<IProfileFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                // this.session$,
                this.customer$,
                this.isLoggedIn$,
            ]
        ).pipe(
            map((
                [
                    // session,
                    customer,
                    isLoggedIn,
                ]
            ) => ({
                // session,
                customer,
                isLoggedIn,
            }))
        );
    }
    // appLogout() {
    //     this.store.dispatch(new AuthStateActions.AuthStateLogout());
    // }
    // loadApp() {
    //     this.store.dispatch(new AuthStateActions.LoadApp());
    // }
    appUploadProfileImage(formData: FormData) {
        return this.store.dispatch(new UserProfileActions.UploadImage(formData))
    }
    setDarkMode(isDarkMode: boolean) {
        return this.store.dispatch(new UserProfileActions.UpdateDarkMode(isDarkMode))
    }
    setFCMStatus(pushAccepted: boolean) {
        return this.store.dispatch(new UserProfileActions.UpdateFcmAccepted(pushAccepted))
    }
}
