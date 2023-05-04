import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../store/auth/auth.state';
import { AuthStateActions } from '../store/auth/auth.actions';
import { UserProfileActions } from '../store/user-profile/user-profile.actions';

@Injectable({
    providedIn: 'root'
})
export class StartFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;
    @Select(AuthState.userEmail) userEmail$: Observable<string>;
    @Select(AuthState.medusaId) medusaId$: Observable<string>;
    @Select(AuthState.getUser) user$: Observable<string>;
    @Select(AuthState.hasSession) hasSession$: Observable<string>;

    readonly viewState$: Observable<any>;
    private store = inject(Store);
    constructor(

    ) {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.userEmail$,
                this.medusaId$,
                this.user$,
                this.hasSession$,
            ]
        ).pipe(
            map(([
                isLoggedIn,
                userEmail,
                medusaId,
                user,
                hasSession,
            ]) => ({
                isLoggedIn,
                userEmail,
                medusaId,
                user,
                hasSession,
            }))
        );
    }
    appLogout() {
        this.store.dispatch(new AuthStateActions.AuthStateLogout());
    }
    loadApp() {
        this.store.dispatch(new AuthStateActions.LoadApp());
    }
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
