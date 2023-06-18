import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { CustomComponentsModule } from 'src/app/components/components.module';
import { ShellModule } from 'src/app/components/shell/shell.module';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { CounterInputComponent } from 'src/app/components/components/counter-input/counter-input.component';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { ShopFacade } from '../../shop.facade';
import { ProductsActions } from 'src/app/store/products/products.actions';
import { register } from 'swiper/element/bundle';
import { ActivatedRoute } from '@angular/router';

register();

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    CustomComponentsModule,
    ShellModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class ProductDetailsPage implements OnInit, OnDestroy {

  @ViewChild('counterInput') counterInput: CounterInputComponent;

  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  logActiveIndex() {
    console.log(this.swiperRef?.nativeElement.swiper.activeIndex);
  }

  viewState$: Observable<any>;

  productOptions: any = [];
  optionsVariants: any = [];
  productVariants: any = [];
  selectedOptionId: string;
  selectedVariantId: string;
  private route = inject(ActivatedRoute);
  private readonly ngUnsubscribe = new Subject();
  constructor(
    private store: Store,
    private navigation: NavigationService,
    private facade: ShopFacade,
    public alertController: AlertController,
  ) {
    this.viewState$ = this.facade.viewState$;
    // this.viewState$
    // .pipe(
    //   takeUntil(this.ngUnsubscribe),
    //   take(1),
    // )
    // .subscribe((vs) => {
    //   console.log(vs);
    // });
  }
  ngOnInit() {
    // this.route.queryParams
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe),
    //     take(1),
    //   )
    //   .subscribe(
    //     (product: any) => {
    //       console.log(product.id);
    //     },
    //   )
  }
  onSelectChange(option: any) {
    this.selectedOptionId = option.id;
    this.optionsVariants = [];
    this.selectedVariantId = '';
    this.optionsVariants = option;
  }
  onSelectOption(option: any) {
    console.log(option.variant_id);
    this.selectedVariantId = option.variant_id;
  }
  onSelectVariant(variantId: any) {
    this.selectedVariantId = variantId.variant_id;
  }
  addToCart() {
    if (this.selectedVariantId && this.counterInput?.counterValue > 0) {
      this.facade.addToMedusaCart(this.selectedVariantId, this.counterInput?.counterValue);
    }
  }
  navigateBack() {
    this.optionsVariants = [];
    this.navigation.navigateFlip('products-list');
    this.store.dispatch(new ProductsActions.clearSelectedProduct());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
