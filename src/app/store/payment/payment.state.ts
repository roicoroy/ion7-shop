import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';

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
    
    @Action(PaymentActions.LogOut)
    logout(ctx: StateContext<PaymentStateModel>) {
        ctx.patchState({
        });
    }
}
