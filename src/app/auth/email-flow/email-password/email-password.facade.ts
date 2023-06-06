import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../../../store/auth/auth.state';
import { Form } from '@angular/forms';
import { EmailPasswordActions } from 'src/app/store/auth/email-password/email-password.actions';

export interface IEmailPasswordFacadeState {
    isLoggedIn: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class EmailPasswordFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<boolean>;

    private store = inject(Store);

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
    loginWithEmail(email: string, password: string): Observable<void> {
        return this.store.dispatch(new EmailPasswordActions.LoginEmailPassword(email, password));
    }
}
