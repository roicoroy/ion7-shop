import { Injectable, OnDestroy, inject } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { CustomerActions } from './customer.actions';
import { ErrorLoggingActions } from '../error-logging/error-logging.actions';
import { AuthStateActions } from '../auth/auth.actions';
import { Subject, catchError, takeUntil, throwError } from 'rxjs';
import { MedusaService } from 'src/app/shared/services/api/medusa.service';
import { ICustomer } from 'src/app/shared/types/types.interfaces';

export class CustomerStateModel {
    customer: any;
}

@State<CustomerStateModel>({
    name: 'customer',
    defaults: {
        customer: null,
    },
})
@Injectable()
export class CustomerState implements OnDestroy {
    private store = inject(Store);
    private medusaApi = inject(MedusaService);

    private subscription = new Subject();

    @Action(CustomerActions.AddAShippingAddress)
    async addaShippingAddress(ctx: StateContext<CustomerStateModel>, { payload }: CustomerActions.AddAShippingAddress) {
        return this.medusaApi.addAddress(payload)
            .pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    console.log('Handling error locally and rethrowing it...', err);
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return throwError(() => new Error(err));
                })
            ).subscribe(() => {
                this.store.dispatch(new AuthStateActions.GetSession());
            });
    }
    @Action(CustomerActions.UpdateCustomerAddress)
    async updateCustomerAddress(ctx: StateContext<CustomerStateModel>, { addressId, payload }: CustomerActions.UpdateCustomerAddress) {
        return this.medusaApi.updateAddress(addressId, payload)
            .pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    console.log('Handling error locally and rethrowing it...', err);
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return throwError(() => new Error(err));
                })
            ).subscribe((customer: ICustomer) => {
                this.store.dispatch(new AuthStateActions.GetSession());
            });
    }
    @Action(CustomerActions.DeleteCustomerAddress)
    async deleteCustomerAddress(ctx: StateContext<CustomerStateModel>, { addressId }: CustomerActions.DeleteCustomerAddress) {
        this.medusaApi.deleteAddress(addressId)
            .pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    console.log('Handling error locally and rethrowing it...', err);
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return throwError(() => new Error(err));
                })
            ).subscribe((response: any) => {
                this.store.dispatch(new AuthStateActions.GetSession());
            });
    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
