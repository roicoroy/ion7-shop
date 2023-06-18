import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { EmailPasswordActions } from './email-password.actions';
import { EmailPasswordService } from './email-password.service';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { MedusaService } from 'src/app/shared/services/api/medusa.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthStateActions } from '../auth.actions';
import { StrapiService } from 'src/app/shared/services/api/strapi.service';
import { IStrapiUser } from 'src/app/shared/types/models/User';

export class IEmailPasswordStateModel { }

@State<IEmailPasswordStateModel>({
    name: 'emailPassword',
})
@Injectable()
export class EmailPasswordState {

    private emailPasswordService = inject(EmailPasswordService);
    private store = inject(Store);

    @Action(EmailPasswordActions.LoginEmailPassword)
    loginEmailPassword(ctx: StateContext<any>, { email, password }: EmailPasswordActions.LoginEmailPassword): any {
        this.emailPasswordService.loginEmailPassword(email, password)
            .pipe(
                catchError(err => {
                    return throwError(() => new Error(JSON.stringify(err)));
                }),
            )
            .subscribe((user) => this.store.dispatch(new AuthStateActions.SetAuthState(user)));
    }
    @Action(EmailPasswordActions.RegisterUser)
    async registerUser(ctx: StateContext<any>, { registerForm }: EmailPasswordActions.RegisterUser) {
        console.log(registerForm);
        this.emailPasswordService.registerEmailPassword(registerForm)
            .pipe(
                catchError(err => {
                    return throwError(() => new Error(JSON.stringify(err)));
                }),
            )
            .subscribe((user) => this.store.dispatch(new AuthStateActions.SetAuthState(user)));
    }
    @Action(EmailPasswordActions.ForgotPassword)
    async forgotPassword(ctx: StateContext<any>, { email }: EmailPasswordActions.ForgotPassword) {
        this.emailPasswordService.forgotPassword(email)
            .pipe(
                catchError(err => {
                    return throwError(() => new Error(JSON.stringify(err)));
                }),
            )
            .subscribe((user) => this.store.dispatch(new AuthStateActions.SetAuthState(user)));
    }
}

