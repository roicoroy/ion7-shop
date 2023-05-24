import { Injectable, OnDestroy, inject } from "@angular/core";
import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { ErrorLoggingActions } from "../error-logging/error-logging.actions";
import { ProductsActions } from "./products.actions";
import { Subject, catchError, takeUntil, throwError } from "rxjs";
import { MedusaService } from "src/app/shared/services/api/medusa.service";

export interface ProductStateModel {
    selectedProduct: any;
    selectedVariant: any;
    productsList: any;
}

export const initStateModel: ProductStateModel = {
    selectedProduct: null,
    selectedVariant: null,
    productsList: null,
};
@State({
    name: 'product',
    defaults: initStateModel,
})
@Injectable()
export class ProductState implements OnDestroy {
    private medusaApi = inject(MedusaService);
    private store = inject(Store);
    subscription = new Subject();

    @Selector()
    static getProductList(state: ProductStateModel) {
        return state.productsList;
    }
    @Selector()
    static getSelectedProduct(state: ProductStateModel) {
        return state.selectedProduct;
    }
    @Selector()
    static getSelectedVariant(state: ProductStateModel) {
        return state.selectedVariant;
    }
    @Action(ProductsActions.GetProductList)
    async getProductList(ctx: StateContext<ProductStateModel>) {
        const response$ = this.medusaApi.productsList();
        response$.pipe(
            takeUntil(this.subscription),
            catchError(err => {
                console.log('Handling error locally and rethrowing it...', err);
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                return throwError(() => new Error(err));
            })
        ).subscribe((response: any) => {
            console.log(response);
            ctx.patchState({
                productsList: response?.products,
            });
        });
    }
    @Action(ProductsActions.addSelectedProduct)
    addProductToState(ctx: StateContext<ProductStateModel>, { payload }: ProductsActions.addSelectedProduct) {
        ctx.patchState({
            selectedProduct: payload,
        });
    }
    @Action(ProductsActions.clearSelectedProduct)
    clearProductFromState(ctx: StateContext<ProductStateModel>): void {
        ctx.patchState({
            selectedProduct: null,
        });
    }
    @Action(ProductsActions.addSelectedVariant)
    addVariantToState(ctx: StateContext<ProductStateModel>, { payload }: ProductsActions.addSelectedVariant) {
        ctx.patchState({
            selectedVariant: payload,
        });
    }
    @Action(ProductsActions.clearSelectedVariant)
    clearVariantFromState(ctx: StateContext<ProductStateModel>) {
        ctx.patchState({
            selectedVariant: null,
        });
    }
    @Action(ProductsActions.ProductsLogOut)
    productsLogOut(ctx: StateContext<ProductStateModel>) {
        ctx.patchState({
            selectedProduct: null,
            selectedVariant: null,
            productsList: null,
        });
    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
