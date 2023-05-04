import { Injectable, OnDestroy } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import Medusa from "@medusajs/medusa-js";
import { AddressesActions } from '../addresses/addresses.actions';
import { environment } from 'src/environments/environment';
import { ErrorLoggingActions } from '../error-logging/error-logging.actions';
import { Subject, from, takeUntil, catchError, throwError } from 'rxjs';

export interface AddressesStateModel {
    selectedAddress: any;
    regionList: any;
    countriesList: any;
    adressDetailsForm: any;
    cartAdressDetailsForm: any;
}
export const initAddressStateModel: AddressesStateModel = {
    selectedAddress: null,
    regionList: [],
    countriesList: [],
    adressDetailsForm: null,
    cartAdressDetailsForm: null,
};
@State({
    name: 'addresses',
    defaults: initAddressStateModel,
})
@Injectable()
export class AddressesState implements OnDestroy{
    medusaClient: any;
    subscription = new Subject();
    constructor(
        private store: Store,
    ) {
        this.medusaClient = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }

    @Selector()
    static getSelectedAddress(state: AddressesStateModel) {
        return state.selectedAddress;
    }
    @Selector()
    static getRegionList(state: AddressesStateModel) {
        return state.regionList;
    }
    @Selector()
    static getCountryList(state: AddressesStateModel): any {
        const coutryList: [] = state.countriesList;
        return coutryList;
    }
    @Action(AddressesActions.GetRegionList)
    async getMedusaRegionList(ctx: StateContext<AddressesStateModel>) {
        const regions$ = from(this.medusaClient.regions.list());
        regions$.pipe(
            takeUntil(this.subscription),
            catchError(err => {
                console.log('Handling error locally and rethrowing it...', err);
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                return throwError(() => new Error(err));
            })
        ).subscribe((response: any) => {
            console.log(response);
            ctx.patchState({
                regionList: response?.regions,
            });
        });
    }
    @Action(AddressesActions.GetCountries)
    async getCountries(ctx: StateContext<AddressesStateModel>, { regionId }: AddressesActions.GetCountries) {
        const region$ = from(this.medusaClient?.regions?.retrieve(regionId));
        region$.pipe(
            takeUntil(this.subscription),
            catchError(err => {
                console.log('Handling error locally and rethrowing it...', err);
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                return throwError(() => new Error(err));
            })
        ).subscribe((response: any) => {
            console.log(response);
            ctx.patchState({
                countriesList: response.region?.countries
            });
        });
    }
    @Action(AddressesActions.AddAddressToState)
    addAddressToState(ctx: StateContext<AddressesStateModel>, { selectedAddress }: AddressesActions.AddAddressToState) {
        ctx.patchState({
            selectedAddress
        });
    }
    @Action(AddressesActions.RemoveAddressFromState)
    removeAddressFromState(ctx: StateContext<AddressesStateModel>) {
        ctx.patchState({
            selectedAddress: null
        });
    }

    @Action(AddressesActions.LogOut)
    logout(ctx: StateContext<AddressesStateModel>) {
        ctx.patchState({
            selectedAddress: null,
            regionList: null,
            countriesList: null,
        });
    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
