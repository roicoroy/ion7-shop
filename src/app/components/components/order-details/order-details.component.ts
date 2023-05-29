import { AfterViewInit, Component, Input, OnDestroy, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MedusaService } from 'src/app/shared/services/api/medusa.service';

export interface IOrderDetailsComponentsData {
  data: any,
}

@Component({
  selector: 'lib-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements AfterViewInit, OnDestroy {

  @Input() orderId: string;

  private medusa = inject(MedusaService);
  private modalCtrl = inject(ModalController);

  order$: Observable<any>;
  subscription = new Subject();

  async ngAfterViewInit(): Promise<void> {
    this.order$ = this.medusa.ordersRetrieve(this.orderId);
    this.order$
      .pipe(
        takeUntil(this.subscription),
      )
      .subscribe((order: any) => {
        console.log(order);
      });
  }

  dismissModal() {
    return this.modalCtrl.dismiss('123', 'confirm');
  }
  ngOnDestroy() {
    this.subscription.next(null);
    this.subscription.complete();
  }
}
