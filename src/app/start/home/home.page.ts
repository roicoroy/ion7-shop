import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { Observable, Subject } from 'rxjs';
import { StartFacade } from '../start-facade';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { AppRoutePath } from 'src/app/app.routers.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    CustomComponentsModule
  ],
})
export class HomePage implements OnDestroy {

  private navigation = inject(NavigationService);
  private facade = inject(StartFacade);
  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<any>;

  constructor() {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$
    //   .subscribe((vs) => {
    //     console.log(vs);
    //   });
  }
  refresh(ev: any) {
    this.facade.loadApp();
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }
  loginPages() {
    this.navigation.navControllerDefault(AppRoutePath.AUTH_HOME);
  }
  shop() {
    this.navigation.navControllerDefault(AppRoutePath.SHOP_PRODUCTS_LIST);
  }
  logout() {
    this.facade.appLogout();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
