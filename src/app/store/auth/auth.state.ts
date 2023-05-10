import { Injectable, OnDestroy, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AuthStateActions } from './auth.actions';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { ICustomerLoginData, ICustomerRegisterData } from 'src/app/shared/types/types.interfaces';
import { AuthStateService } from './auth-state.service';
import { StateClear } from 'ngxs-reset-plugin';
import { Subject, catchError, combineLatestWith, from, map, switchMap, takeUntil, throwError } from 'rxjs';
import { IUser } from 'src/app/shared/types/models/User';
import { HttpHeaders } from '@angular/common/http';
import Medusa from "@medusajs/medusa-js";
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

export class IAuthStateModel {
    isLoggedIn: boolean;
    user: IUser;
    customer: any;
    userEmail: string;
}
@State<IAuthStateModel>({
    name: 'authState',
    defaults: {
        isLoggedIn: null,
        user: null,
        customer: null,
        userEmail: null,
    },
})
@Injectable()
export class AuthState implements OnDestroy {
    private store = inject(Store);
    private authService = inject(AuthStateService);
    private tokenService = inject(TokenService);
    private navigation = inject(NavigationService);
    subscription = new Subject();
    medusa: any;
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor() {
        this.medusa = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }

    @Selector()
    static isLoggedIn(state: IAuthStateModel) {
        return state.isLoggedIn;
    }
    @Selector()
    static getUser(state: IAuthStateModel) {
        return state.user;
    }
    @Selector()
    static getCustomer(state: IAuthStateModel) {
        return state.customer;
    }
    @Selector()
    static userEmail(state: IAuthStateModel) {
        return state.userEmail;
    }
    @Action(AuthStateActions.LoadApp)
    async loadApp(ctx: StateContext<IAuthStateModel>) {
        const state = ctx.getState();
        if (!state.customer) {
            this.store.dispatch(new AuthStateActions.GetSession());
            // console.log('get session');
        }
        if (!state.user && !state.customer) {
            this.store.dispatch(new AuthStateActions.AuthStateLogout());
            // console.log('auth logout');
        }
    }
    @Action(AuthStateActions.SetAuthState)
    async setAuthState(ctx: StateContext<IAuthStateModel>, { user }: AuthStateActions.SetAuthState) {
        // console.log(user);
        const state = ctx.getState();
        if (user.jwt && user.user) {
            this.tokenService.setToken(user.jwt);
            const customer$ = this.medusaCustomerInit(user.user.email);
            const user$ = this.authService.loadUser(user.user.id)
            user$
                .pipe(
                    takeUntil(this.subscription),
                    catchError(err => {
                        const error = throwError(() => new Error(JSON.stringify(err.response.data)));
                        return error;
                    }),
                    combineLatestWith(customer$),
                )
                .subscribe((user) => {
                    const newUser = user[0];
                    const userEmail = user[0].email;
                    // console.log(newUser);
                    return ctx.patchState({
                        ...state,
                        isLoggedIn: true,
                        userEmail: userEmail,
                        user: newUser,
                    });
                });
        }
    }
    @Action(AuthStateActions.GetSession)
    async getSession(ctx: StateContext<IAuthStateModel>) {
        const state = ctx.getState();

        const session$ = from(this.medusa.auth.getSession())
        const customer$ = from(this.medusa.customers.retrieve());

        session$.pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err.response.data)));
                return error;
            }),
            combineLatestWith(customer$),
        ).subscribe((cusomers: any) => {
            // console.log(cusomers[0].customer);
            return ctx.patchState({
                ...state,
                customer: cusomers[0].customer,
            });
        });
    }
    @Action(AuthStateActions.LoadStrapiUser)
    loadStrapiUser(ctx: StateContext<IAuthStateModel>, { userId }: AuthStateActions.LoadStrapiUser) {
        const state = ctx.getState();
        this.authService.loadUser(userId)
            .pipe(
                takeUntil(this.subscription),
            )
            .subscribe((user: IUser) => {
                // console.log(user);
                return ctx.patchState({
                    ...state,
                    isLoggedIn: true,
                    userEmail: user.email,
                    user: user,
                });
            });
    }

    @Action(AuthStateActions.SetLoggedIn)
    async authProviderCallback(ctx: StateContext<IAuthStateModel>, { isLoggedIn }: AuthStateActions.SetLoggedIn) {
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            isLoggedIn: true
        });
    }


    @Action(AuthStateActions.AuthStateLogout)
    authStateLogout(ctx: StateContext<IAuthStateModel>, { }: AuthStateActions.AuthStateLogout) {
        this.authService.medusaLogout();
        this.tokenService.deleteToken();
        this.store.dispatch(new StateClear());
        this.navigation.navControllerDefault('/start/tabs/home');
        return ctx.setState({
            isLoggedIn: null,
            customer: null,
            user: null,
            userEmail: null,
        });
    }
    medusaCustomerInit(email: string) {
        return from(this.medusa.auth.exists(email)).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
            switchMap((medusaUserExist: any) => {
                if (medusaUserExist.exists && email !== null) {
                    const loginReq: ICustomerLoginData = {
                        email: email,
                        password: email,
                    };
                    return from(this.medusa.auth?.authenticate(loginReq));
                }
                else if (!medusaUserExist.exists && email !== null) {
                    const registerRequest: ICustomerRegisterData = {
                        email: email,
                        password: email,
                    };
                    return from(this.medusa.customers?.create(registerRequest));
                }
            }),
        );
    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
