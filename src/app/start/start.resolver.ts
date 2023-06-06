import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Actions, Store, ofActionCompleted } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthStateActions } from '../store/auth/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class StartResolver implements Resolve<Observable<any>> {

    private store = inject(Store);
    private actions$ = inject(Actions);
    // constructor(private readonly store: Store, private readonly actions: Actions) {}

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        const isLoggedIn = this.store.selectSnapshot<any>((state: any) => state.authState.isLoggedIn);
        if (isLoggedIn) {
            return this.store.dispatch(new AuthStateActions.LoadApp());
        }
    }
}
