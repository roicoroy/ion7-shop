
export namespace ProductsActions {
    export class GetProductList {
        public static readonly type = '[ProductsState] Get Product State product List';
    }
    export class addSelectedProduct {
        public static readonly type = '[ProductsState] Add Selected Products';
        constructor(public readonly payload: any) { }
    }
    export class clearSelectedProduct {
        public static readonly type = '[ProductsState] Clear Selected Products';
    }
    export class addSelectedVariant {
        public static readonly type = '[ProductsState] Add Selected  Variant';
        constructor(public readonly payload: any) { }
    }
    export class clearSelectedVariant {
        public static readonly type = '[ProductsState] Clear Selected Variant';
    }
    export class ProductsLogOut {
        public static readonly type = '[ProductsState] Clear Selected Variant';
    }

}