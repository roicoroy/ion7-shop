import { IResAuthLogin } from "src/app/shared/types/responses/ResAuthLogin";
import { IResAuthRegister } from "src/app/shared/types/responses/ResAuthRegister";

export namespace AuthStateActions {
    export class LoadApp {
        static readonly type = '[AuthStateActions] Load App';
    }
    export class GetCustomer {
        static readonly type = '[AuthStateActions] Get Customer';
    }
    export class CreateMedusaCustomer {
        static readonly type = '[AuthStateActions] Create Medusa Customer';
        constructor(public email: string, public password: string) { }
    }
    export class getMedusaSession {
        static readonly type = '[AuthStateActions] Get Medusa Session';
    }
    export class SetAuthState {
        static readonly type = '[AuthStateActions] Auth State';
        constructor(public user: IResAuthRegister | IResAuthLogin) { }
        // userEmail: string, public userId: string
    }
    export class SetLoggedIn {
        static readonly type = '[AuthStateActions] Set Logged In';
        constructor(public isLoggedIn: boolean) { }
    }
    export class SetUserEmail {
        static readonly type = '[AuthStateActions] Set User Email';
        constructor(public userEmail: string) { }
    }
    export class SetUserId {
        static readonly type = '[AuthStateActions] Set User Id';
        constructor(public userId: string) { }
    }
    export class AuthStateLogout {
        static readonly type = '[AuthStateActions] Auth State Logout';
    }
}
