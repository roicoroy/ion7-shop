export namespace ShippingActions {
    export class GetShippingOptions {
        static readonly type = '[ShippingActions] Shipping Get Shipping Options';
    }
    export class AddShippingMethod {
        static readonly type = '[ShippingActions] Shipping Add Shipping Method';
        constructor(public option_id: string) { }
    }
    export class SetPaymentSession {
        static readonly type = '[ShippingActions] Shipping Set Payment Session';
        constructor(public provider_id: string) { }
    }
    export class LogOut {
        static readonly type = '[ShippingActions] Shipping Logout, clear medusa state';
    }
}
