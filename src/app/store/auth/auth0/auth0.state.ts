import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { Auth0Service } from './auth0.service';
import { Auth0Actions } from './auth0.actions';
import { AuthStateActions } from '../auth.actions';
import { catchError, throwError, tap } from 'rxjs';
import { ErrorLoggingActions } from '../../error-logging/error-logging.actions';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';

export class IAuth0StateModel { }
@State<IAuth0StateModel>({
    name: 'auth0',
})
@Injectable()
export class Auth0State {
    private store = inject(Store);
    private auth = inject(Auth0Service);
    private utility = inject(UtilityService);

    @Action(Auth0Actions.Auth0ProviderCallback)
    async authProviderCallback(ctx: StateContext<IAuth0StateModel>, { token, provider }: Auth0Actions.Auth0ProviderCallback) {
        this.utility.presentLoading('...');
        this.auth.callbackProviderLogin(token, provider)
            .pipe(
                catchError(err => {
                    this.utility.dismissLoading();
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return throwError(() => new Error(JSON.stringify(err)));
                })
            )
            .subscribe((user: any) => {
                if (user) {
                    this.store.dispatch(new AuthStateActions.SetAuthState(user));
                    this.utility.dismissLoading();
                }
            });
    }
}
