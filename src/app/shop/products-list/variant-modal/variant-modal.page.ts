import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CounterInputComponent } from 'src/app/components/components/counter-input/counter-input.component';
import { Observable } from 'rxjs';
import { CartActions } from 'src/app/store/cart/cart.actions';
import { Store } from '@ngxs/store';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { ShopFacade } from '../../shop.facade';

@Component({
  selector: 'app-variant-modal',
  templateUrl: './variant-modal.page.html',
  styleUrls: ['./variant-modal.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CustomComponentsModule
  ]
})
export class VariantModalPage implements OnInit {

  private modalCtrl = inject(ModalController);
  private store = inject(Store);
  private facade = inject(ShopFacade);

  @ViewChild('counterInput') counterInput: CounterInputComponent;

  @Input() variant: any;

  viewState$: Observable<any>;

  ngOnInit() {
    this.viewState$ = this.facade.viewState$;
  }
  addToCart() {
    if (this.variant.id && this.counterInput?.counterValue > 0) {
      this.facade.addToMedusaCart(this.variant.id, this.counterInput?.counterValue);
      this.dismiss();
    }
    this.dismiss();
  }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }
}
