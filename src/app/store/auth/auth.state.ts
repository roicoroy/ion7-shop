import { Injectable, OnDestroy, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AuthStateActions } from './auth.actions';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { AuthStateService } from './auth-state.service';
import { StateClear } from 'ngxs-reset-plugin';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { IUser } from 'src/app/shared/types/models/User';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { MedusaService } from 'src/app/shared/services/api/medusa.service';

export class IAuthStateModel {
    isLoggedIn: boolean;
    user: IUser;
    customer: any;
    userEmail: string;
    token: string;
}
@State<IAuthStateModel>({
    name: 'authState',
    defaults: {
        isLoggedIn: null,
        user: null,
        customer: null,
        userEmail: null,
        token: null,
    },
})
@Injectable()
export class AuthState implements OnDestroy {

    private store = inject(Store);
    
    private authService = inject(AuthStateService);
    
    private tokenService = inject(TokenService);

    private navigation = inject(NavigationService);

    subscription = new Subject();

    private medusa = inject(MedusaService);

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
    @Selector()
    static getToken(state: IAuthStateModel) {
        return state.token;
    }
    @Action(AuthStateActions.LoadApp)
    async loadApp(ctx: StateContext<IAuthStateModel>) {
        const state = ctx.getState();
        console.log('load app', state);
        if (!state.customer) {
            this.store.dispatch(new AuthStateActions.GetSession());
            console.log('get session');
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
        const email = user.user.email;
        this.tokenService.setToken(user.jwt);

        this.medusa.medusaExistsHttp(email)
            .pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(JSON.stringify(err)));
                    return error;
                }),

            ).subscribe((res: any) => {
                if (res.exists) {
                    this.medusa.loginEmailPassword(email)
                        .pipe(
                            takeUntil(this.subscription),
                            catchError(err => {
                                const error = throwError(() => new Error(JSON.stringify(err)));
                                return error;
                            }),

                        )
                        .subscribe((customer: any) => {
                            this.store.dispatch(new AuthStateActions.LoadStrapiUser(user.user.id));
                            return ctx.patchState({
                                ...state,
                                customer: customer.customer,
                                isLoggedIn: true,
                                userEmail: email,
                            });
                        });
                }
                if (!res.exists) {
                    this.medusa.createMedusaCustomer(email).pipe(
                        takeUntil(this.subscription),
                        catchError(err => {
                            const error = throwError(() => new Error(JSON.stringify(err)));
                            return error;
                        }),

                    ).subscribe((customer: any) => {
                            this.store.dispatch(new AuthStateActions.LoadStrapiUser(user.user.id));
                            return ctx.patchState({
                                ...state,
                                customer: customer.customer,
                                isLoggedIn: true,
                                userEmail: email,
                            });
                        });
                }
            });
    }
    @Action(AuthStateActions.GetSession)
    async getSession(ctx: StateContext<IAuthStateModel>) {
        const state = ctx.getState();
        this.medusa.getMedusaSession().subscribe((customer: any) => {
            // console.log('session', customer);
            ctx.patchState({
                ...state,
                customer: customer.customer,
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
                console.log(user);
                return ctx.patchState({
                    ...state,
                    isLoggedIn: true,
                    userEmail: user.email,
                    user: user,
                });
            });
    }

    // @Action(AuthStateActions.GetToken)
    // async getToken(ctx: StateContext<IAuthStateModel>) {
    //     const state = ctx.getState();
    //     ctx.patchState({
    //         ...state,
    //         token: token
    //     });
    // }

    @Action(AuthStateActions.SetToken)
    async setToken(ctx: StateContext<IAuthStateModel>, { token }: AuthStateActions.SetToken) {
        const state = ctx.getState();

        console.log(token);

        ctx.patchState({
            ...state,
            token: token
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
            token: null,
        });
    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
