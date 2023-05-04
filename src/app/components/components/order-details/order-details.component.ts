import { AfterViewInit, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import Medusa from "@medusajs/medusa-js";
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface IOrderDetailsComponentsData {
  data: any,
}

@Component({
  selector: 'lib-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements AfterViewInit {

  @Input() orderId: string;

  // @Input() set orderDetailsData(value: IOrderDetailsComponentsData | any) {
  //   console.log(value);
  // };

  medusaClient: any;

  order$: Observable<any>;

  constructor(
    private modalCtrl: ModalController,
  ) {
    this.medusaClient = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
  }

  async ngAfterViewInit(): Promise<void> {
    this.order$ = from(this.medusaClient.orders.retrieve(this.orderId));
    this.order$
      .subscribe((order: any) => {
        console.log(order);
      });
  }

  dismissModal() {
    return this.modalCtrl.dismiss('123', 'confirm');
  }

}
