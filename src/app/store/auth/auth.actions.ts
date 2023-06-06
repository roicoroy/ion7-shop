import { IStrapiUser } from "src/app/shared/types/models/User";

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
    export class SetToken {
        static readonly type = '[AuthStateActions] Set Token';
        constructor(public token: string) { }
    }
    export class SetLoggedIn {
        static readonly type = '[AuthStateActions] Set Logged In';
        constructor(public isLoggedIn: boolean) { }
    }
    export class AuthStateLogout {
        static readonly type = '[AuthStateActions] Auth State Logout';
    }
}
