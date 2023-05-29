import { Injectable, OnDestroy, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { AddressesActions } from '../addresses/addresses.actions';
import { ErrorLoggingActions } from '../error-logging/error-logging.actions';
import { Subject, takeUntil, catchError, throwError } from 'rxjs';
import { MedusaService } from 'src/app/shared/services/api/medusa.service';

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
export class AddressesState implements OnDestroy {
    subscription = new Subject();
    private medusaApi = inject(MedusaService);
    private store = inject(Store);

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
        const regions$ = this.medusaApi.regionsList();
        regions$.pipe(
            takeUntil(this.subscription),
            catchError(err => {
                console.log('Handling error locally and rethrowing it...', err);
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                return throwError(() => new Error(err));
            })
        ).subscribe((response: any) => {
            ctx.patchState({
                regionList: response?.regions,
            });
        });
    }
    @Action(AddressesActions.GetCountries)
    getCountries(ctx: StateContext<AddressesStateModel>, { regionId }: AddressesActions.GetCountries) {
        const region$ = this.medusaApi.regionsRetrieve(regionId);;
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
