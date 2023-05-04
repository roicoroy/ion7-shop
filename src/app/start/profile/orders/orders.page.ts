import { Component, OnInit, inject } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { NgxsModule, Store } from '@ngxs/store';
import { OrderDetailsComponent } from 'src/app/components/components/order-details/order-details.component';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { ProfileFacade } from '../profile.facade';
import { AuthStateActions } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    TranslateModule,
  ]
})
export class OrdersPage implements OnInit {

  viewState$: Observable<any>;

  presentingElement: any = HTMLElement;

  modalCtrl = inject(ModalController);
  private navigation = inject(NavigationService);
  private facade = inject(ProfileFacade);
  private store = inject(Store);

  constructor() {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$.subscribe((vs) => {
    //   console.log(vs);
    // })
  }
  ngOnInit() {
    this.store.dispatch(new AuthStateActions.getMedusaSession());

    this.presentingElement = document.querySelector('#main-content');
  }
  back() {
    this.navigation.navigateFlip('/customer');
  }
  async openOrderDetails(orderId: any) {
    const modal = await this.modalCtrl.create({
      component: OrderDetailsComponent,
      presentingElement: this.presentingElement,
      componentProps: {
        orderId: orderId
      }
    });
    modal.present();
  }
  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
