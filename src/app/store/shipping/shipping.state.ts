import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import Medusa from "@medusajs/medusa-js";
import { environment } from 'src/environments/environment';
import { ShippingActions } from './shipping.actions';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

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
    medusaClient: any;

    private http = inject(HttpClient);
    private store = inject(Store);
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    subscription = new Subject();

    constructor() {
        this.medusaClient = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }

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
        // const shipping_options$ = from(this.medusaClient.shippingOptions.listCartOptions(cartId));
        const cart = this.store.selectSnapshot<any>((state: any) => state.cart?.cart);
        const shipping_options = await this.medusaClient.shippingOptions.listCartOptions(cart.id);
        return ctx.patchState({
            shipping_options: shipping_options?.shipping_options
        });
    }

    @Action(ShippingActions.AddShippingMethod)
    async addShippingMethod(ctx: StateContext<ShippingStateModel>, { option_id }: ShippingActions.AddShippingMethod) {
        const state = ctx.getState();
        const cartObj = this.store.selectSnapshot<any>((state: any) => state.cart?.cart);
        console.log(state.payment_sessions);
        if (state.payment_sessions) {
            const cart = await this.medusaClient.carts.addShippingMethod(cartObj.id, {
                option_id: option_id
            });
            console.log(cart);
            return ctx.patchState({
                ...state,
                payment_sessions: cart.cart?.payment_sessions
            });
        } else {
            const cart = await this.medusaClient.carts.createPaymentSessions(cartObj.id);
            return ctx.patchState({
                payment_sessions: cart.data?.payment_sessions
            });
        }
    }

    @Action(ShippingActions.SetPaymentSession)
    async setPaymentSession(ctx: StateContext<ShippingStateModel>, { provider_id }: ShippingActions.SetPaymentSession) {
        const state = ctx.getState();
        const cartRes = this.store.selectSnapshot<any>((state: any) => state.cart?.cart);
        const cart = await this.medusaClient.carts.setPaymentSession(cartRes.id, {
            provider_id: provider_id,
        });
        console.log(cart.cart.payment_session.data?.client_secret);
        ctx.patchState({
            ...state,
            provider_id: cart.cart?.provider_id,
            client_secret: cart.cart.payment_session.data?.client_secret,
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
