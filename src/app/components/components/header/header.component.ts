import { AfterViewInit, Component, Input, OnInit, inject } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { HeaderFacade, IHeaderFacadeState } from './header.facade';

export interface IHeaderData {
  avatar: string,
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  // @Input() set avatar(value: string) {
  //   console.log(value);
  //   // this._isLoggedIn = value.isCustomerLoggedIn != null ? value?.isCustomerLoggedIn : false;
  // };
  private facade = inject(HeaderFacade);

  @Input() avatar: string;
  @Input() menuId: string;

  viewState$: Observable<IHeaderFacadeState>;

  constructor(
    private navigation: NavigationService,
    public menu: MenuController,
  ) {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe((vs) => {
    //   console.log(vs);
    // });
  }
  toggleMenu(menuId: string = 'start') {
    this.menu.toggle(menuId);
  }
  home() {
    this.navigation.navigateForward('/home', 'forward');
  }
  login() {
    this.navigation.navControllerDefault('/auth/pages/auth-home');
  }
  logout() {
  }
}
