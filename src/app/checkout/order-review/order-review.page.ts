import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { IOrderReviewFacadeState, OrderReviewFacade } from './order-review.facade';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.page.html',
  styleUrls: ['./order-review.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class OrderReviewPage implements OnInit, OnDestroy {
  private facade = inject(OrderReviewFacade);

  private navigation = inject(NavigationService);

  private readonly ngUnsubscribe = new Subject();

  viewState$: Observable<IOrderReviewFacadeState>;

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((vs) => {
    //     console.log(vs);
    //   });
  }
  details() {
  }
  next() {
    this.navigation.navControllerDefault('checkout/pages/checkout-home');
  }
  back() {
    this.navigation.navControllerDefault('checkout/pages/checkout-home');
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
