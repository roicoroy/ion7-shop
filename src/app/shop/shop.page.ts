import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ShopFacade } from './shop.facade';

@Component({
  selector: 'app-shop',
  templateUrl: 'shop.page.html',
  styleUrls: ['shop.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
  ],
})
export class ShopPage {

  public environmentInjector = inject(EnvironmentInjector);

  private facade = inject(ShopFacade);

  constructor() {
    this.facade.loadApp();
  }
}
