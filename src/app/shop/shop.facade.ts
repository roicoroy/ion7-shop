import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';
import { ProductState } from 'src/app/store/products/products.state';
import { CartActions } from '../store/cart/cart.actions';
import { AuthStateActions } from '../store/auth/auth.actions';
import { UtilityService } from '../shared/services/utility/utility.service';
import { IUser } from '../shared/types/models/User';


export interface IShopFacadeState {
    user: IUser,
    customer: any,
    isLoggedIn: boolean,
    selectedVariant: any,
    productList: any,
}

@Injectable({
    providedIn: 'root'
})
export class ShopFacade {

    @Select(AuthState.getUser) user$: Observable<any>;

    @Select(AuthState.getCustomer) customer$: Observable<any>;

    @Select(AuthState.isLoggedIn) isLoggedIn$: Observable<any>;

    @Select(ProductState.getSelectedProduct) selectedProduct$: Observable<any>;

    @Select(ProductState.getSelectedVariant) selectedVariant$: Observable<any>;

    @Select(ProductState.getProductList) productList$: Observable<any>;

    private store = inject(Store);

    private utility = inject(UtilityService);

    readonly viewState$: Observable<IShopFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.user$,
                this.customer$,
                this.isLoggedIn$,
                this.selectedProduct$,
                this.selectedVariant$,
                this.productList$,
            ]
        ).pipe(
            map((
                [
                    user,
                    customer,
                    isLoggedIn,
                    selectedProduct,
                    selectedVariant,
                    productList
                ]
            ) => ({
                user,
                customer,
                isLoggedIn,
                selectedProduct,
                selectedVariant,
                productList,
            }))
        );
    }
    loadApp() {
        // this.store.dispatch(new AuthStateActions.LoadApp());
    }
    async addToMedusaCart(selectedVariantId: string, counterValue: number) {
        
        console.log(selectedVariantId, counterValue);

        this.store.dispatch(new CartActions.AddToCart(selectedVariantId, counterValue))

        // const isLoggedIn = this.store.selectSnapshot<any>((state) => state.authState.isLoggedIn);
        // if (isLoggedIn) {
        //     const cartId = this.store.selectSnapshot<any>((state) => state.cart?.cart?.id);
        //     if (cartId != null && selectedVariantId != null) {
        //         this.store.dispatch(new AuthStateActions.getMedusaSession());
        //         this.store.dispatch(new CartActions.AddProductMedusaToCart(cartId, counterValue, selectedVariantId));
        //     } else {
        //         this.store.dispatch(new AuthStateActions.getMedusaSession());
        //         this.store.dispatch(new CartActions.CreateMedusaCart())
        //             .subscribe((state) => {
        //                 console.log(state);
        //                 // this.store.dispatch(new CartActions.AddProductMedusaToCart(state.cart.cart?.id, counterValue, selectedVariantId));
        //             });
        //         const cart = await this.store.selectSnapshot<any>((state) => state.cart?.cart);
        //         console.log(cart);
        //     }
        // } else {
        //     this.utility.presentAlert('Need to login first, please...');
        // }
    }
}
