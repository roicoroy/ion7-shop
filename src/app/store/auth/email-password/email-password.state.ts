import { Injectable, inject } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { EmailPasswordActions } from './email-password.actions';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { EmailPasswordService } from './email-password.service';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';
import { IUser } from 'src/app/shared/types/models/User';
import { AuthStateActions } from '../auth.actions';

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
    async loginEmailPassword(ctx: StateContext<any>, { email, password }: EmailPasswordActions.LoginEmailPassword) {
        return this.emailPasswordService.loginEmailPassword(email, password)
            .pipe(
                switchMap((user: any) => {
                    return this.store.dispatch(new AuthStateActions.SetAuthState(user));
                }),
                catchError(err => {
                    return throwError(() => new Error(JSON.stringify(err)));
                }),
            )
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
