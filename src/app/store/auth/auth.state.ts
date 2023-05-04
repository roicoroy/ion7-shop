import { Injectable, OnDestroy, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AuthStateActions } from './auth.actions';
import Medusa from "@medusajs/medusa-js";
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/services/token/token.service';
import { IResAuthLogin } from 'src/app/shared/types/responses/ResAuthLogin';
import { IResAuthRegister } from 'src/app/shared/types/responses/ResAuthRegister';
import { ICustomer, ICustomerLoginData, ICustomerRegisterData } from 'src/app/shared/types/types.interfaces';
import { ErrorLoggingActions } from '../error-logging/error-logging.actions';
import { AuthStateService } from './auth-state.service';
import { StateClear } from 'ngxs-reset-plugin';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { Observable, Subject, catchError, from, take, takeUntil, tap, throwError } from 'rxjs';
import { IUser } from 'src/app/shared/types/models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export class IAuthStateModel {
    isLoggedIn: any;
    userId: any;
    user: any;
    customer: any;
    session: any;
    userEmail: any;
    medusaId: any;
    hasSession: any;
}
@State<IAuthStateModel>({
    name: 'authState',
    defaults: {
        isLoggedIn: null,
        userId: null,
        user: null,
        customer: null,
        session: null,
        userEmail: null,
        medusaId: null,
        hasSession: null
    },
    // children: AuthStates
})
@Injectable()
export class AuthState implements OnDestroy {
    private store = inject(Store);
    private authService = inject(AuthStateService);
    private navigation = inject(NavigationService);
    private tokenService = inject(TokenService);
    private http = inject(HttpClient);

    subscription = new Subject();

    medusa: any;

    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor() {
        this.medusa = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }

    @Selector()
    static getCustomer(state: IAuthStateModel) {
        return state.customer;
    }
    @Selector()
    static getSession(state: IAuthStateModel) {
        return state.session;
    }
    @Selector()
    static isLoggedIn(state: IAuthStateModel) {
        return state.isLoggedIn;
    }
    @Selector()
    static userId(state: IAuthStateModel) {
        return state.userId;
    }
    @Selector()
    static userEmail(state: IAuthStateModel) {
        return state.userEmail;
    }
    @Selector()
    static medusaId(state: IAuthStateModel) {
        return state.medusaId;
    }
    @Selector()
    static hasSession(state: IAuthStateModel) {
        return state.hasSession;
    }
    @Selector()
    static getUser(state: IAuthStateModel) {
        return state.user;
    }
    @Action(AuthStateActions.LoadApp)
    async loadApp(ctx: StateContext<IAuthStateModel>) {
        const state = ctx.getState();
        if (state.session && state.customer && state.user) {
            // console.log('load return ');
            return;
        }
        if (!state.session && !state.customer) {
            this.store.dispatch(new AuthStateActions.getMedusaSession());
            console.log('get session');
        }
        if (!state.userId && !state.user && !state.session && !state.customer) {
            this.store.dispatch(new AuthStateActions.AuthStateLogout());
            console.log('auth logout');
        }
    }
    @Action(AuthStateActions.SetAuthState)
    async setAuthState(ctx: StateContext<IAuthStateModel>, { user }: AuthStateActions.SetAuthState) {
        const state = ctx.getState();
        if (user.jwt && user.user) {
            this.setTokenResponse(user);
            const customer$ = from(this.medusaCustomerInit(user.user.email));
            customer$
                .pipe(
                    takeUntil(this.subscription),
                    catchError(err => {
                        const error = throwError(() => new Error(err.response.data));
                        return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                    })
                )
                .subscribe(async (medusaCustomer) => {
                    console.log(medusaCustomer);
                    if (medusaCustomer) {
                        this.authService.loadUser(user.user.id)
                            .pipe(
                                take(1),
                                takeUntil(this.subscription),
                            )
                            .subscribe(async (user: IUser) => {
                                console.log(user);
                                ctx.patchState({
                                    ...state,
                                    isLoggedIn: true,
                                    userEmail: user.email,
                                    userId: user?.id,
                                    user: user,
                                    customer: medusaCustomer,
                                    session: medusaCustomer,
                                    hasSession: true,
                                });
                            });
                    }
                });
        }
    }
    @Action(AuthStateActions.getMedusaSession)
    async getSession(ctx: StateContext<IAuthStateModel>) {
        const state = ctx.getState();
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.userId);
        const sessionRes = await this.medusa.auth?.getSession();
        const customerRes = await this.medusa.customers.retrieve();
        if (sessionRes?.customer != null
            && sessionRes.response?.status === 200
            && customerRes?.customer != null
            && customerRes.response?.status === 200
        ) {
            this.authService.loadUser(userId)
                .pipe(
                    catchError(err => {
                        this.navigation.navControllerDefault('auth/pages/auth-home');
                        const error = throwError(() => new Error(err.response.data));
                        return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                    }),
                    take(1),
                    takeUntil(this.subscription),
                )
                .subscribe((user: IUser) => {
                    ctx.patchState({
                        ...state,
                        isLoggedIn: true,
                        userEmail: user.email,
                        userId: user?.id,
                        user: user,
                        medusaId: customerRes.customer.id,
                        customer: customerRes.customer,
                        session: sessionRes.customer,
                        hasSession: true,
                    });
                });
        }
        else {
            throwError(() => new Error('Email is null'));
            this.navigation.navControllerDefault('auth/pages/auth-home');
            console.log('Email is null');
        }
    }
    @Action(AuthStateActions.GetCustomer)
    async getCustomer(ctx: StateContext<IAuthStateModel>, { }: AuthStateActions.GetCustomer) {
        try {
            const state = ctx.getState();
            const userEmail = await this.store.selectSnapshot<any>((state: any) => state.authState?.userEmail);
            const customer = await this.buildCustomerObj(userEmail);
            let session = await this.medusa.auth?.getSession();
            ctx.patchState({
                ...state,
                isLoggedIn: true,
                customer: customer,
                session: session.customer,
                hasSession: true,
            });
        } catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                const state = ctx.getState();
                ctx.patchState({
                    ...state,
                    hasSession: false,
                });
            }
        }
    }
    @Action(AuthStateActions.SetLoggedIn)
    async authProviderCallback(ctx: StateContext<IAuthStateModel>, { isLoggedIn }: AuthStateActions.SetLoggedIn) {
        const state = ctx.getState();
        const userId = await this.store.selectSnapshot<any>((state: any) => state.authState?.userId);
        if (userId !== null) {
            this.authService.loadUser(userId)
                .pipe(takeUntil(this.subscription),)
                .subscribe((user: any) => {
                    ctx.patchState({
                        ...state,
                        user: user,
                        isLoggedIn: true
                    });
                });
        };
    }
    @Action(AuthStateActions.AuthStateLogout)
    authStateLogout(ctx: StateContext<IAuthStateModel>, { }: AuthStateActions.AuthStateLogout) {
        this.authService.medusaLogout();
        this.tokenService.deleteToken();
        this.store.dispatch(new StateClear());
        // this.navigation.navControllerDefault('/start/tabs/home');
        return ctx.setState({
            isLoggedIn: null,
            userId: null,
            customer: null,
            user: null,
            session: null,
            userEmail: null,
            medusaId: null,
            hasSession: null
        });
    }
    /**
     * Write token to store and
     * call auth state subject
     */
    async setTokenResponse(res: IResAuthRegister | IResAuthLogin): Promise<void> {
        try {
            if (res.jwt && res.user) {
                await this.tokenService.setToken(res.jwt);
            }
        } catch (err: any) {
            if (err) {
                const error = throwError(() => new Error(err.response.data));
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
            }
        }
    }

    checkIfMedusaUserExists(email: string) {
        return this.http.get(environment.MEDUSA_API_BASE_PATH + '/store/auth/' + email, { headers: this.headers })
            .pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(err.response.data));
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                })
            );
    }
    authenticateMedusaCustomer(email: string) {
        const loginReq: ICustomerLoginData = {
            email: email,
            password: email,
        };
        return this.http.post(environment.MEDUSA_API_BASE_PATH + '/store/auth/', loginReq, { headers: this.headers })
            .pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(err.response.data));
                    return this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                })
            );
    }
    async medusaCustomerInit(email: string) {
        try {
            const medusaEmailExist = await this.medusa.auth.exists(email);
            if (medusaEmailExist.exists && email !== null) {
                const loginReq: ICustomerLoginData = {
                    email: email,
                    password: email,
                };
                let loggedInCustomer = await this.medusa.auth?.authenticate(loginReq);
                return loggedInCustomer.customer;
            }
            else if (!medusaEmailExist.exists && email !== null) {
                const registerRequest: ICustomerRegisterData = {
                    email: email,
                    password: email,
                };
                let registeredCustomer = await this.medusa.customers?.create(registerRequest);
                return registeredCustomer.customer;
            }
            // return lCustomer;
        } catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    async getMedusaSession(): Promise<any> {
        try {
            let sessionRes = await this.medusa.auth?.getSession();
            let customerRes = await this.medusa.customers.retrieve();
            return { sessionRes, customerRes };
        } catch (err: any) {
            if (err) {
                const error = throwError(() => new Error(err.response.data));
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
            }
        }
    }
    async buildCustomerObj(email: string) {

        const medusaEmailExist = await this.medusa.auth.exists(email);
        if (medusaEmailExist.exists) {
            const loginReq: ICustomerLoginData = {
                email: email,
                password: email,
            };
            let loggedInCustomer = await this.medusa.auth?.authenticate(loginReq);
            return loggedInCustomer.customer;
        }
        else {
            const registerRequest: ICustomerRegisterData = {
                email: email,
                password: email,
            };
            let registeredCustomer = await this.medusa.customers?.create(registerRequest);
            return registeredCustomer.customer;
        }
        // try {
        //     const medusaEmailExist = await this.medusa.auth.exists(email);
        //     if (medusaEmailExist.exists) {
        //         const loginReq: ICustomerLoginData = {
        //             email: email,
        //             password: email,
        //         };
        //         let loggedInCustomer = await this.medusa.auth?.authenticate(loginReq);
        //         return loggedInCustomer.customer;
        //     }
        //     else {
        //         const registerRequest: ICustomerRegisterData = {
        //             email: email,
        //             password: email,
        //         };
        //         let registeredCustomer = await this.medusa.customers?.create(registerRequest);
        //         return registeredCustomer.customer;
        //     }
        // } catch (err: any) {
        //     if (err) {
        //         this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
        //     }
        // }
    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
