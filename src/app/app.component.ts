import { Component, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IonicModule, MenuController, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { CustomComponentsModule } from './components/components.module';
import { Subject, Observable } from 'rxjs';
import { CartMenuComponent } from './components/components/cart-menu/cart-menu.component';
import { MedusaCartComponent } from './components/components/medusa-cart/medusa-cart.component';
import { AppService } from './shared/services/application/application.service';
import { NavigationService } from './shared/services/navigation/navigation.service';
import { ThemeService } from './shared/services/theme/theme-generation.service';
import { TokenService } from './shared/services/token/token.service';
import { AuthStateActions } from './store/auth/auth.actions';
import { AppFacade, IAppFacadeState } from './app.facade';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    IonicModule,
    RouterLink,
    RouterLinkActive,
    IonicModule,
    CommonModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    CustomComponentsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild(MedusaCartComponent) medusaCartComponent: MedusaCartComponent;

  @ViewChild(CartMenuComponent) menuComponent: CartMenuComponent;

  private native = inject(AppService);
  private platform = inject(Platform);
  private tokenService = inject(TokenService);
  private store = inject(Store);
  private theme = inject(ThemeService);
  private facade = inject(AppFacade);
  private menu = inject(MenuController);
  private navigation = inject(NavigationService);
  
  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<IAppFacadeState>;


  async ngOnInit(): Promise<void> {
    await this.initApp();
  }

  async initApp() {
    this.platform.ready().then(async () => {
      this.viewState$ = this.facade.viewState$;
      // this.viewState$
      // .pipe(takeUntil(this.ngUnsubscribe))
      //   .subscribe((vs) => { });
      
      const device = await this.native.getDeviceInfo();
      const token = await this.tokenService.getToken();
      const userEmail = await this.store.selectSnapshot<any>((state: any) => state.authState?.userEmail);
      if (token && userEmail) {
        // this.store.dispatch(new AuthStateActions.SetLoggedIn(true));
      }
      if (device.platform == 'web') {
      }
      if (device.platform === 'android' || device.platform === 'ios') {
      }
    }).catch(e => {
      throw e;
    });
  }
  checkout() {
    this.menu.toggle('end').then(() => {
    });
  }
  logout(): void {
    this.store.dispatch(new AuthStateActions.AuthStateLogout());
  }
  homePage(): void {
    this.navigation.navControllerDefault('/start/tabs/home')
  }
  loginPage(): void {
    this.navigation.navControllerDefault('/auth/pages/auth-home')
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
