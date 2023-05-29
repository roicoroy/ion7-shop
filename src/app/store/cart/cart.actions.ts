import { IRegisterAddress } from "src/app/shared/types/types.interfaces";

export namespace CartActions {
    export class AddToCart {
        static readonly type = '[CartActions] AddToCart';
        constructor(public selectedVariantId: string, public counterValue: number) { }
    }
    export class GetMedusaCart {
        static readonly type = '[CartActions] Get Medsa Cart With ID';
        constructor(public cartId: string) { }
    }
    export class UpdateCartBillingAddress {
        static readonly type = '[CartActions] Update Billing Address Cart';
        constructor(public cartId: string | any, public address: IRegisterAddress | any) { }
    }
    export class UpdateCartShippingAddress {
        static readonly type = '[CartActions] Update Shipping Address Cart';
        constructor(public cartId: string | any, public address: IRegisterAddress | any) { }
    }
    export class UpdateCart {
        static readonly type = '[CartActions] Update Cart';
        constructor(public cartId: string | any, public customer: any | any) { }
    }
    export class AddProductMedusaToCart {
        static readonly type = '[CartActions] Add Products to Medusa Cart with Id, variantId and qty';
        constructor(public cartId: string, public quantity: number, public variantId: string) { }
    }
    export class DeleteProductMedusaFromCart {
        static readonly type = '[CartActions] Delete Product from Medusa Cart line items';
        constructor(public cart_id: string, public line_id: string,) { }
    }
    export class CreateCartWithRegionId {
        // country_code
        // string
        // The 2 character ISO country code to create the Cart in.
        static readonly type = '[CartActions] Create Cart With Region Id';
        constructor(public regionId: string) { }
    }
    export class UpdateRegionCountryCart {
        static readonly type = '[CartActions] Update Region Country Cart';
        constructor(public cartId: string | any, public payload: any | any) { }
    }
    export class UpdateSelectedRegion {
        static readonly type = '[CartActions] Update Selected Region';
        constructor(public selectedRegion: any | any) { }
    }
    export class UpdateSelectedCountry {
        static readonly type = '[CartActions] Update Selected Country';
        constructor(public selectedCountry: any | any) { }
    }
    export class CompleteCart {
        static readonly type = '[CartActions] Complete Cart';
        constructor(public cartId: string | any) { }
    }
    export class ClearIsGuest {
        static readonly type = '[CartActions] Clear Is Guest';
    }
    export class LogOut {
        static readonly type = '[CartActions] Logout';
    }
}
