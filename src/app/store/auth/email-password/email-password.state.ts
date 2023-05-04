import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { EmailPasswordActions } from './email-password.actions';
import { catchError, throwError } from 'rxjs';
import { AuthStateActions } from '../auth.actions';
import { IAuth0StateModel } from '../auth0/auth0.state';
import { EmailPasswordService } from './email-password.service';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';
import { ErrorLoggingActions } from '../../error-logging/error-logging.actions';

export class IEmailPasswordStateModel { }

@State<IEmailPasswordStateModel>({
    name: 'emailPassword',
})
@Injectable()
export class EmailPasswordState {

    private emailPasswordService = inject(EmailPasswordService);
    private store = inject(Store);
    private utility = inject(UtilityService);

    @Action(EmailPasswordActions.LoginEmailPassword)
    async loginEmailPassword(ctx: StateContext<IAuth0StateModel>, { email, password }: EmailPasswordActions.LoginEmailPassword) {
        this.emailPasswordService.loginEmailPassword(email, password)
            .pipe(
                catchError(err => {
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return throwError(() => new Error(JSON.stringify(err)));
                })
            )
            .subscribe((user: any) => {
                if (user) {
                    this.store.dispatch(new AuthStateActions.SetAuthState(user));
                }
            });
    }
    @Action(EmailPasswordActions.RegisterUser)
    async registerUser(ctx: StateContext<IAuth0StateModel>, { registerForm }: EmailPasswordActions.RegisterUser) {
        // console.log(ctx);
        console.log(registerForm);
    }
    @Action(EmailPasswordActions.ForgotPassword)
    async forgotPassword(ctx: StateContext<IAuth0StateModel>, { email }: EmailPasswordActions.ForgotPassword) {
        console.log(email);
    }
}
