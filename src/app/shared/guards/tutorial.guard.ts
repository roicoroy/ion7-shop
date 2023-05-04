import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Store } from '@ngxs/store';
import { IStates } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class TutorialGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store
  ) { }
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {

    const isComplete = this.store.selectSnapshot<any>((state: IStates) => state.tutorial.isTutorialComplete);
    console.log(isComplete);
    if (!isComplete) {
      this.router.navigateByUrl('/tutorial');
    }
    return isComplete;
  }
}
