import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthStateActions } from '../store/auth/auth.actions';
import { AddressesActions } from '../store/addresses/addresses.actions';
import { ShippingActions } from '../store/shipping/shipping.actions';

@Injectable({
    providedIn: 'root'
})
export class CheckoutResolver implements Resolve<Observable<any>> {
    private store = inject(Store);
    resolve(): Observable<any> {
        this.store.dispatch(new ShippingActions.GetShippingOptions());
        this.store.dispatch(new AddressesActions.GetRegionList());
        return this.store.dispatch(new AuthStateActions.LoadApp());
    }
}