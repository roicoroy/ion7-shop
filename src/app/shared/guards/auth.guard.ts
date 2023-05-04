import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';

import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    // private auth: AuthService,
    private alertController: AlertController,
    private router: Router
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // const uid = await this.auth.uid();
    // const isLoggedIn = !!uid;

    // if (!isLoggedIn) {
    //   const alert = await this.alertController.create({
    //     // header: '',
    //     subHeader: 'Users only',
    //     message: 'got to login first',
    //     buttons: ['OK']
    //   });

    //   await alert.present();
    //   this.router.navigateByUrl('/');
    // }

    // return isLoggedIn;
    return false;
  }
}
