import { Injectable, OnDestroy, inject } from "@angular/core";
import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { CartActions } from "./cart.actions";
import { IRegisterAddress } from "src/app/shared/types/types.interfaces";
import { ErrorLoggingActions } from "../error-logging/error-logging.actions";
import { MedusaService } from "src/app/shared/services/api/medusa.service";
import { Subject, takeUntil, catchError, throwError } from "rxjs";
import { AuthStateActions } from "../auth/auth.actions";

export interface CartStateModel {
    recentCompletedOrder: any;
    selectedRegion: string;
    selectedCountry: string;
    cart: any;
}

export const initStateModel: CartStateModel = {
    recentCompletedOrder: null,
    selectedRegion: null,
    selectedCountry: null,
    cart: null,
};
@State({
    name: 'cart',
    defaults: initStateModel,
})
@Injectable()
export class CartState implements OnDestroy {
    private medusaApi = inject(MedusaService);

    private store = inject(Store);

    subscription = new Subject();

    @Selector()
    static getRecentCompletedOrder(state: CartStateModel) {
        return state.recentCompletedOrder;
    }
    @Selector()
    static getCart(state: CartStateModel) {
        return state.cart;
    }
    @Selector()
    static getCartId(state: CartStateModel): string {
        return state.cart.id;
    }
    @Action(CartActions.GetMedusaCart)
    async getMedusaCart(ctx: StateContext<CartStateModel>, { cartId }: CartActions.GetMedusaCart) {
        this.medusaApi.cartsRetrieve(cartId).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((cart: any) => {
            return ctx.patchState({
                cart: cart?.cart,
            });
        });
    }
    @Action(CartActions.AddToCart)
    async addToCart(ctx: StateContext<CartStateModel>, { selectedVariantId, counterValue }: CartActions.AddToCart) {
        const state = ctx.getState();
        const data = {
            variant_id: selectedVariantId,
            quantity: counterValue,
        }
        if (!state?.cart && selectedVariantId && counterValue) {
            this.medusaApi.cartsCreate().pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(JSON.stringify(err)));
                    return error;
                }),
            ).subscribe((cart: any) => {
                this.medusaApi.cartsLineItemsAdd(cart.cart?.id, data)
                    .pipe(
                        takeUntil(this.subscription),
                        catchError(err => {
                            const error = throwError(() => new Error(JSON.stringify(err)));
                            return error;
                        }),
                    ).subscribe((cartWithItems: any) => {
                        return ctx.patchState({
                            cart: cartWithItems?.cart,
                        });
                    });
            });
        }
        if (state?.cart && selectedVariantId && counterValue) {
            this.medusaApi.cartsLineItemsAdd(state.cart?.id, data).pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(JSON.stringify(err)));
                    return error;
                }),
            ).subscribe((cartWithItems: any) => {
                return ctx.patchState({
                    cart: cartWithItems?.cart,
                });
            });
        }
    }
    @Action(CartActions.UpdateCartBillingAddress)
    async updateCartBillingAddress(ctx: StateContext<CartStateModel>, { cartId, address }: CartActions.UpdateCartBillingAddress) {
        const editedAddress: IRegisterAddress = {
            first_name: address?.first_name,
            last_name: address?.last_name,
            address_1: address?.address_1,
            address_2: address?.address_2,
            city: address?.city,
            country_code: address?.country_code,
            postal_code: address?.postal_code,
            phone: address?.phone,
        };
        const regionList = await this.store.selectSnapshot<any>((state: any) => state.addresses?.regionList);
        const regionId = await this.buildRegionCode(editedAddress.country_code, regionList);
        const data = {
            region_id: regionId,
            country_code: editedAddress?.country_code
        }
        this.medusaApi.cartsUpdate(cartId, data).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((regionRes: any) => {
            const postData = {
                billing_address: editedAddress,
                customer_id: regionRes.cart.customer_id,
            }
            this.medusaApi.cartsUpdate(cartId, postData).pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(JSON.stringify(err)));
                    return error;
                }),
            ).subscribe((cart: any) => {
                ctx.patchState({
                    cart: cart?.cart,
                });
                this.store.dispatch(new AuthStateActions.GetSession());
            });
        });
    }
    @Action(CartActions.UpdateCartShippingAddress)
    async updateCartShippingAddress(ctx: StateContext<CartStateModel>, { cartId, address }: CartActions.UpdateCartShippingAddress) {
        const editedAddress: IRegisterAddress = {
            first_name: address?.first_name,
            last_name: address?.last_name,
            address_1: address?.address_1,
            address_2: address?.address_2,
            city: address?.city,
            country_code: address?.country_code,
            postal_code: address?.postal_code,
            phone: address?.phone,
        };
        const regionList = await this.store.selectSnapshot<any>((state: any) => state.addresses?.regionList);
        const regionId = await this.buildRegionCode(editedAddress.country_code, regionList);
        const data = {
            region_id: regionId,
            country_code: editedAddress?.country_code
        }
        this.medusaApi.cartsUpdate(cartId, data).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((regionRes: any) => {
            const postData = {
                shipping_address: editedAddress,
                customer_id: regionRes.cart.customer_id,
            }
            this.medusaApi.cartsUpdate(cartId, postData).pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(JSON.stringify(err)));
                    return error;
                }),
            ).subscribe((cart: any) => {
                ctx.patchState({
                    cart: cart?.cart,
                });
                this.store.dispatch(new AuthStateActions.GetSession());
            });
        });
    }
    @Action(CartActions.AddProductMedusaToCart)
    async addProductMedusaToCart(ctx: StateContext<CartStateModel>, { cartId, quantity, variantId }: CartActions.AddProductMedusaToCart) {
        const data = {
            variant_id: variantId,
            quantity: quantity
        }
        this.medusaApi.cartsUpdate(cartId, data).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((cart: any) => {
        });
    }
    @Action(CartActions.UpdateCart)
    async updateCart(ctx: StateContext<CartStateModel>, { cartId, customer }: CartActions.UpdateCart) {
        const editedCustomer: IRegisterAddress = {
            first_name: customer?.first_name,
            last_name: customer?.last_name,
            address_1: customer?.address_1,
            address_2: customer?.address_2,
            city: customer?.city,
            country_code: customer?.country_code,
            postal_code: customer?.postal_code,
            phone: customer?.phone,
        };
        const regionList = await this.store.selectSnapshot<any>((state: any) => state.addresses?.regionList);
        // console.log(regionList);
        const region_id = await this.buildRegionCode(editedCustomer.country_code, regionList);
        // console.log(region_id);
        const data = {
            region_id: region_id,
        }
        this.medusaApi.cartsUpdate(cartId, data).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((regionRes: any) => {
            const newData = {
                billing_address: editedCustomer,
                shipping_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            }
            this.medusaApi.cartsUpdate(cartId, data).pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    const error = throwError(() => new Error(JSON.stringify(err)));
                    return error;
                }),
            ).subscribe((cartRes: any) => {
                ctx.patchState({
                    cart: cartRes?.cart,
                });
                this.store.dispatch(new CartActions.GetMedusaCart(cartId));
                this.store.dispatch(new AuthStateActions.GetSession());
            });
        });
    }
    @Action(CartActions.UpdateRegionCountryCart)
    async updateRegionCountryCart(ctx: StateContext<CartStateModel>, { cartId, payload }: CartActions.UpdateRegionCountryCart) {
        const data = {
            region_id: payload.region_id != null ? payload.region_id : null,
            country_code: payload?.country_code
        }
        this.medusaApi.cartsUpdate(cartId, data).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((cart: any) => {
            this.store.dispatch(new CartActions.UpdateSelectedCountry(payload?.country_code))
            this.store.dispatch(new CartActions.UpdateSelectedRegion(payload.region_id))
        });
    }
    @Action(CartActions.DeleteProductMedusaFromCart)
    async deleteProductMedusaFromCart(ctx: StateContext<CartStateModel>, { cart_id, line_id }: CartActions.DeleteProductMedusaFromCart) {
        this.medusaApi.cartsLineItemsDelete(cart_id, line_id).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((cart: any) => {
            ctx.patchState({
                cart: cart?.cart,
            });
            this.store.dispatch(new AuthStateActions.GetSession());
        });
    }


    @Action(CartActions.CreateCartWithRegionId)
    async createCartWithRegionId(ctx: StateContext<CartStateModel>, { regionId }: CartActions.CreateCartWithRegionId) {
        this.medusaApi.cartsCreate().pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((cart: any) => {
            ctx.patchState({
                cart: cart?.cart,
            });
        });
    }
    @Action(CartActions.CompleteCart)
    completeCart(ctx: StateContext<CartStateModel>, { cartId }: CartActions.CompleteCart) {
        return this.medusaApi.completeMedusaCart(cartId).pipe(
            takeUntil(this.subscription),
            catchError(err => {
                const error = throwError(() => new Error(JSON.stringify(err)));
                return error;
            }),
        ).subscribe((cart: any) => {
            ctx.patchState({
                recentCompletedOrder: cart?.data ? cart?.data : null,
            });
        });
    }
    @Action(CartActions.UpdateSelectedRegion)
    async updateselectedRegion(ctx: StateContext<CartStateModel>, { selectedRegion }: CartActions.UpdateSelectedRegion) {
        // console.log(selectedRegion);
        try {
            ctx.patchState({
                selectedRegion: selectedRegion,
            });
        }
        catch (err: any) {
            if (err.response) {
            }
        }
    }
    @Action(CartActions.UpdateSelectedCountry)
    async updateSelectedCountry(ctx: StateContext<CartStateModel>, { selectedCountry }: CartActions.UpdateSelectedCountry) {
        try {
            ctx.patchState({
                selectedCountry: selectedCountry,
            });
        }
        catch (err: any) {
            if (err.response) {
            }
        }
    }
    async buildRegionCode(country_code: string, regionList: [] = []): Promise<string> {
        const countries = regionList.map((region: any, i: any) => region.countries);
        const result = [].concat(...countries);
        const filtered: any = result.filter((region: any) => {
            return region.iso_2 === country_code;
        });
        return filtered[0]?.region_id;
    }
    @Action(CartActions.LogOut)
    async logout(ctx: StateContext<CartStateModel>) {
        ctx.setState({
            cart: null,
            recentCompletedOrder: null,
            selectedRegion: null,
            selectedCountry: null,
        });
    }
    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
