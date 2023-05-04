import { Component, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AppMenuFacade } from './app-menu.facade';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cart-menu',
  templateUrl: './cart-menu.component.html',
  styleUrls: ['./cart-menu.component.scss'],
})
export class CartMenuComponent {

  viewState$: Observable<any>;

  @Input() menuId: string = 'end';

  @Input() icon = 'cart-outline';

  cartItemsCount: number;

  constructor(
    public menu: MenuController,
    private facade: AppMenuFacade,
  ) {
    this.viewState$ = this.facade.viewState$;
    this.viewState$.subscribe((vs)=>{
      console.log(vs.cart?.items);
    })

  }
  closeCartMenu(menuId: any) {
    this.menu.toggle(menuId);
  }
}
