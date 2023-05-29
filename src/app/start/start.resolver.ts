import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthStateActions } from '../store/auth/auth.actions';

@Injectable({
    providedIn: 'root'
})
export class StartResolver implements Resolve<Observable<any>> {
    private store = inject(Store);
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this.store.dispatch(new AuthStateActions.LoadApp());
    }
}
