import { IStrapiUser, IUser } from "src/app/shared/types/models/User";
import { IResAuthLogin } from "src/app/shared/types/responses/ResAuthLogin";
import { IResAuthRegister } from "src/app/shared/types/responses/ResAuthRegister";

export namespace AuthStateActions {
    export class LoadApp {
        static readonly type = '[AuthStateActions] Load App';
    }
    export class SetAuthState {
        static readonly type = '[AuthStateActions] Auth State';
        constructor(public user: IStrapiUser) { }
        // userEmail: string, public userId: string
    }
    export class GetSession {
        static readonly type = '[AuthStateActions] Get Medusa Session';
    }
    export class LoadStrapiUser {
        static readonly type = '[AuthStateActions] Load Strapi User';
        constructor(public userId: string) { }
    }
    export class SetLoggedIn {
        static readonly type = '[AuthStateActions] Set Logged In';
        constructor(public isLoggedIn: boolean) { }
    }
    export class AuthStateLogout {
        static readonly type = '[AuthStateActions] Auth State Logout';
    }
}
