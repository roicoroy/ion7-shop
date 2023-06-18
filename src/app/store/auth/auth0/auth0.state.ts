import { Injectable, inject } from '@angular/core';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { Auth0Actions } from './auth0.actions';
import { AuthStateActions } from '../auth.actions';
import { catchError, throwError, tap } from 'rxjs';
import { ErrorLoggingActions } from '../../error-logging/error-logging.actions';
import { UtilityService } from 'src/app/shared/services/utility/utility.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StrapiAuthProviders } from "src/app/shared/types/StrapiAuthConfig";
import { environment } from "src/environments/environment";


export class IAuth0StateModel { }
@State<IAuth0StateModel>({
    name: 'auth0',
})
@Injectable()
export class Auth0State {
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    private store = inject(Store);
    private http = inject(HttpClient);
    private utility = inject(UtilityService);


    /**
     * Login user using external provider
     * like google / facebook / microsoft / github
     */
    callbackProviderLogin(params: string, provider: StrapiAuthProviders) {
        return this.http.get(environment.BASE_PATH + '/api/auth/' + provider + '/callback?id_token=' + params, { headers: this.headers });
    }

    @Action(Auth0Actions.Auth0ProviderCallback)
    async authProviderCallback(ctx: StateContext<IAuth0StateModel>, { token, provider }: Auth0Actions.Auth0ProviderCallback) {
        this.utility.presentLoading('...');
        this.callbackProviderLogin(token, provider)
            .pipe(
                catchError(err => {
                    this.utility.dismissLoading();
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return throwError(() => new Error(JSON.stringify(err)));
                })
            )
            .subscribe((user: any) => {
                if (user) {

                    console.log(user);

                    this.store.dispatch(new AuthStateActions.SetAuthState(user));
                    this.utility.dismissLoading();
                } else {
                    this.utility.dismissLoading();
                }
            });
    }
}
