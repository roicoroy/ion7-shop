import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AddressesState } from 'src/app/store/addresses/addresses.state';

@Injectable({
    providedIn: 'root'
})
export class AddressDetailsFormFacade {

    @Select(AddressesState.getRegionList) regionList$: Observable<any>;

    @Select(AddressesState.getCountryList) countryList$: Observable<any>;

    readonly viewState$: Observable<any>;

    constructor(
    ) {
        this.viewState$ = combineLatest(
            [
                this.regionList$,
                this.countryList$,
            ]
        ).pipe(
            map((
                [
                    regionList,
                    countryList,
                ]
            ) => ({
                regionList,
                countryList,
            }))
        );
    }
}
