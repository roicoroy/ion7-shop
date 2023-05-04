import { IRegisterAddress } from "src/app/shared/types/types.interfaces";

export namespace CustomerRegisterActions {

    export class AddaShippingAddress {
        static readonly type = '[CustomerRegisterActions] Customer Register Add a Shipping Address';
        constructor(public payload: IRegisterAddress) { }
    }
    export class AddBillingAddress {
        static readonly type = '[CustomerRegisterActions] Customer Register Add a Billing Address';
        constructor(public payload: IRegisterAddress) { }
    }
    export class UpdateCustomerRegisterAddress {
        static readonly type = '[CustomerRegisterActions] Customer Update Address for customer';
        constructor(public payload: any) { }
    }
    export class LogOut {
        static readonly type = '[CustomerRegisterActions] Customer Register Logout, clear shop state';
    }
}
