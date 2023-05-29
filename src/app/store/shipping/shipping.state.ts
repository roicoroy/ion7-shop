import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { ShippingActions } from './shipping.actions';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { MedusaService } from 'src/app/shared/services/api/medusa.service';
import { AuthStateActions } from '../auth/auth.actions';

export interface ShippingStateModel {
    shipping_options: any;
    payment_sessions: string;
    provider_id: string;
    client_secret: string;
}
export const initStateModel: ShippingStateModel = {
    shipping_options: null,
    payment_sessions: null,
    provider_id: null,
    client_secret: null,
};
@State({
    name: 'shipping',
    defaults: initStateModel,
})
@Injectable()
export class ShippingState {
    private store = inject(Store);
    private medusaApi = inject(MedusaService);
    subscription = new Subject();

    @Selector()
    static getShippingOptions(state: ShippingStateModel) {
        return state.shipping_options;
    }
    @Selector()
    static getPaymentSessions(state: ShippingStateModel) {
        return state.payment_sessions;
    }
    @Selector()
    static getSecretKey(state: ShippingStateModel) {
        return state.client_secret;
    }

    @Action(ShippingActions.GetShippingOptions)
    async getShippingOptions(ctx: StateContext<ShippingStateModel>) {
        const state = ctx.getState();
        const cartObj = this.store.selectSnapshot<any>((state: any) => state.cart?.cart);
        this.medusaApi.shippingOptions(cartObj.id).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((shipping_options: any) => {
            return ctx.patchState({
                ...state,
                shipping_options: shipping_options.shipping_options,
            });
        });
    }

    @Action(ShippingActions.AddShippingMethod)
    async addShippingMethod(ctx: StateContext<ShippingStateModel>, { option_id }: ShippingActions.AddShippingMethod) {
        const state = ctx.getState();
        const cartObj = this.store.selectSnapshot<any>((state: any) => state.cart?.cart);
        if (state.payment_sessions) {

            this.store.dispatch(new AuthStateActions.GetSession());

            this.medusaApi.addShippingMethod(cartObj.id, option_id).pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(JSON.stringify(err)));
                    return error;
                }),
            ).subscribe((cart: any) => {
                return ctx.patchState({
                    ...state,
                    payment_sessions: cart.cart?.payment_sessions
                });
            });
        } else {
            this.medusaApi.createPaymentSessions(cartObj.id).pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(JSON.stringify(err)));
                    return error;
                }),
            ).subscribe((cart: any) => {
                return ctx.patchState({
                    ...state,
                    payment_sessions: cart.cart?.payment_sessions
                });
            });
        }
    }

    @Action(ShippingActions.SetPaymentSession)
    async setPaymentSession(ctx: StateContext<ShippingStateModel>, { provider_id }: ShippingActions.SetPaymentSession) {
        const state = ctx.getState();
        const cartRes = this.store.selectSnapshot<any>((state: any) => state.cart?.cart);
        const data = {
            provider_id: provider_id
        }
        this.medusaApi.setPaymentSession(cartRes.id, provider_id).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((cart: any) => {
            console.log(cart.cart?.payment_session?.data?.client_secret);
            ctx.patchState({
                ...state,
                provider_id: cart.cart?.provider_id,
                client_secret: cart.cart?.payment_session?.data?.client_secret,
            });
        });
    }

    @Action(ShippingActions.LogOut)
    logout(ctx: StateContext<ShippingStateModel>) {
        ctx.patchState({
            shipping_options: null,
            payment_sessions: null,
            provider_id: null,
        });
    }
}
