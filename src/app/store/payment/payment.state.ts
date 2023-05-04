import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import Medusa from "@medusajs/medusa-js";
import { environment } from 'src/environments/environment';
import { PaymentActions } from './payment.actions';

export interface PaymentStateModel {
    // selectedAddress: any | null;
    // regionList: any | any;
    // countriesList: any | any;
}
export const initStateModel: PaymentStateModel = {
    // selectedAddress: null,
    // regionList: null,
    // countriesList: null,
};
@State({
    name: 'payment',
    defaults: initStateModel,
})
@Injectable()
export class PaymentState {
    medusaClient: any;

    constructor(
        private store: Store,
    ) {
        this.medusaClient = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }

    @Action(PaymentActions.LogOut)
    logout(ctx: StateContext<PaymentStateModel>) {
        ctx.patchState({
        });
    }
}
