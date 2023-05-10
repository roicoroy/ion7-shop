import { Injectable } from "@angular/core";
import Medusa from "@medusajs/medusa-js";
import { State, Store, Selector, Action, StateContext } from "@ngxs/store";
import { environment } from "src/environments/environment";
import { AddressesActions } from "../addresses/addresses.actions";
import { CartActions } from "./cart.actions";
import { IRegisterAddress } from "src/app/shared/types/types.interfaces";
import { ErrorLoggingActions } from "../error-logging/error-logging.actions";
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
export class CartState {
    medusa: any;

    constructor(
        private store: Store,
    ) {
        this.medusa = new Medusa({ baseUrl: environment.MEDUSA_API_BASE_PATH, maxRetries: 10 });
    }
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
        try {
            let cart = await this.medusa.carts?.retrieve(cartId);
            ctx.patchState({
                cart: cart?.cart,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err)); console.log(err);
            }
        }
    }
    @Action(CartActions.AddToCart)
    async addToCart(ctx: StateContext<CartStateModel>, { selectedVariantId, counterValue }: CartActions.AddToCart) {
        const state = ctx.getState();
        if (!state?.cart && selectedVariantId && counterValue) {
            const cart = await this.medusa.carts.create();
            const cartWithItems = await this.medusa.carts.lineItems.create(cart.cart?.id, {
                variant_id: selectedVariantId,
                quantity: counterValue,
            });
            return ctx.patchState({
                cart: cartWithItems?.cart,
            });
        }
        if (state?.cart && selectedVariantId && counterValue) {
            const cartWithItems = await this.medusa.carts.lineItems.create(state?.cart?.id, {
                variant_id: selectedVariantId,
                quantity: counterValue,
            });
            return ctx.patchState({
                cart: cartWithItems?.cart,
            });
        } else {
            const cart = await this.medusa.carts.create();
            return ctx.patchState({
                cart: cart?.cart,
            });
        }
    }
    @Action(CartActions.UpdateCartBillingAddress)
    async updateCartBillingAddress(ctx: StateContext<CartStateModel>, { cartId, address }: CartActions.UpdateCartBillingAddress) {
        try {
            console.log(cartId, address);
            const editedCustomer: IRegisterAddress = {
                first_name: address?.first_name,
                last_name: address?.last_name,
                address_1: address?.address_1,
                address_2: address?.address_2,
                city: address?.city,
                country_code: address?.country_code,
                postal_code: address?.postal_code,
                phone: address?.phone,
            };
            this.store.dispatch(new AddressesActions.GetRegionList());
            const regionList = await this.store.selectSnapshot<any>((state: any) => state.addresses?.regionList);
            const region_id = await this.buildRegionCode(editedCustomer.country_code, regionList);
            let regionRes = await this.medusa.carts.update(cartId, {
                region_id: region_id,
                country_code: editedCustomer?.country_code
            });
            let cartRes = await this.medusa.carts.update(cartId, {
                billing_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            });
            ctx.patchState({
                cart: cartRes?.cart,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.UpdateCartShippingAddress)
    async updateCartShippingAddress(ctx: StateContext<CartStateModel>, { cartId, address }: CartActions.UpdateCartShippingAddress) {
        try {
            // console.log(cartId, address);
            const editedCustomer: IRegisterAddress = {
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
            const regionId = await this.buildRegionCode(editedCustomer.country_code, regionList);
            // console.log(regionList, regionId);
            let regionRes = await this.medusa.carts.update(cartId, {
                region_id: regionId,
                country_code: editedCustomer?.country_code
            });
            let cart = await this.medusa.carts.update(cartId, {
                shipping_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            });
            ctx.patchState({
                cart: cart?.cart,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.UpdateCart)
    async updateCart(ctx: StateContext<CartStateModel>, { cartId, customer }: CartActions.UpdateCart) {
        try {
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
            console.log(regionList);

            const region_id = await this.buildRegionCode(editedCustomer.country_code, regionList);
            console.log(region_id);

            let regionRes = await this.medusa.carts.update(cartId, {
                region_id: region_id,
            });
            let cartRes = await this.medusa.carts.update(cartId, {
                billing_address: editedCustomer,
                shipping_address: editedCustomer,
                customer_id: regionRes.cart.customer_id,
            });
            ctx.patchState({
                cart: cartRes?.cart,
            });
            this.store.dispatch(new CartActions.GetMedusaCart(cartId));
            this.store.dispatch(new AuthStateActions.GetSession());
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
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
    @Action(CartActions.AddProductMedusaToCart)
    async addProductMedusaToCart(ctx: StateContext<CartStateModel>, { cartId, quantity, variantId }: CartActions.AddProductMedusaToCart) {
        try {
            let cart = await this.medusa.carts.lineItems.create(cartId, {
                variant_id: variantId,
                quantity: quantity
            });
            ctx.patchState({
                cart: cart?.cart,
            });
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }

    }
    @Action(CartActions.DeleteProductMedusaFromCart)
    async deleteProductMedusaFromCart(ctx: StateContext<CartStateModel>, { cart_id, line_id }: CartActions.DeleteProductMedusaFromCart) {
        try {
            let cart = await this.medusa.carts.lineItems.delete(cart_id, line_id);
            ctx.patchState({
                cart: cart?.cart,
            });
            this.store.dispatch(new AuthStateActions.GetSession());
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.CreateCartWithRegionId)
    async createCartWithRegionId(ctx: StateContext<CartStateModel>, { regionId }: CartActions.CreateCartWithRegionId) {
        try {
            let cart = await this.medusa.carts.create({
                region_id: regionId
            });
            // this.store.dispatch(new UserActions.GetSession());
            if (cart) {
                ctx.patchState({
                    cart: cart?.cart,
                });
            }
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
    }
    @Action(CartActions.UpdateRegionCountryCart)
    async updateRegionCountryCart(ctx: StateContext<CartStateModel>, { cartId, payload }: CartActions.UpdateRegionCountryCart) {
        try {
            let cart = await this.medusa.carts.update(cartId, {
                region_id: payload.region_id != null ? payload.region_id : null,
                country_code: payload?.country_code
            });
            this.store.dispatch(new CartActions.UpdateSelectedCountry(payload?.country_code))
            this.store.dispatch(new CartActions.UpdateSelectedRegion(payload.region_id))
        }
        catch (err: any) {
            if (err.response) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
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
        // console.log(selectedCountry);
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
    @Action(CartActions.CompleteCart)
    async completeCart(ctx: StateContext<CartStateModel>, { cartId }: CartActions.CompleteCart) {
        try {
            const cart = await this.medusa.carts.complete(cartId);
            ctx.patchState({
                recentCompletedOrder: cart?.data ? cart?.data : null,
            })
        }
        catch (err: any) {
            if (err) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
            }
        }
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
}
