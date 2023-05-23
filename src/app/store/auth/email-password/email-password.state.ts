import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { EmailPasswordActions } from './email-password.actions';
import { EmailPasswordService } from './email-password.service';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { AuthStateService } from '../auth-state.service';
import { MedusaService } from 'src/app/shared/services/api/medusa.service';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { AuthStateActions } from '../auth.actions';
import { StrapiService } from 'src/app/shared/services/api/strapi.service';

export class IEmailPasswordStateModel { }

@State<IEmailPasswordStateModel>({
    name: 'emailPassword',
})
@Injectable()
export class EmailPasswordState {

    private emailPasswordService = inject(EmailPasswordService);
    private store = inject(Store);
    private utility = inject(UtilityService);
    private tokenService = inject(TokenService);
    private authService = inject(AuthStateService);
    private strapi = inject(StrapiService);
    private medusa = inject(MedusaService);

    @Action(EmailPasswordActions.LoginEmailPassword)
    loginEmailPassword(ctx: StateContext<any>, { email, password }: EmailPasswordActions.LoginEmailPassword): any {
        this.emailPasswordService.loginEmailPassword(email, password)
            .pipe(
                tap((user: any) => {
                    console.log(user);
                    return this.store.dispatch(new AuthStateActions.SetAuthState(user));
                }),
                catchError(err => {
                    return throwError(() => new Error(JSON.stringify(err)));
                }),
            )
            .subscribe((user: any) => {
                // console.log(user);
                // // this.store.dispatch(new AuthStateActions.SetAuthState(user));
                // // if (user.jwt && user.user) {
                // //     // this.store.dispatch(new AuthStateActions.SetToken(user.jwt));
                // //     // this.tokenService.setToken(user.jwt);
                // //     this.store.dispatch(new AuthStateActions.SetAuthState(user));
                // // }
            });
    }
    @Action(EmailPasswordActions.RegisterUser)
    async registerUser(ctx: StateContext<any>, { registerForm }: EmailPasswordActions.RegisterUser) {
        console.log(registerForm);
    }
    @Action(EmailPasswordActions.ForgotPassword)
    async forgotPassword(ctx: StateContext<any>, { email }: EmailPasswordActions.ForgotPassword) {
        console.log(email);
    }
}

