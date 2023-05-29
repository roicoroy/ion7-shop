import { IReqAuthRegister } from "src/app/shared/types/requests/ReqAuthRegister";

export namespace EmailPasswordActions {
    export class LoginEmailPassword {
        static readonly type = '[EmailPasswordActions] Login Email Password';
        constructor(public email: string, public password: string) { }
    }
    export class RegisterUser {
        static readonly type = '[EmailPasswordActions] Register User';
        constructor(public registerForm: IReqAuthRegister) { }
    }
    export class ForgotPassword {
        static readonly type = '[EmailPasswordActions] Forgot Password';
        constructor(public email: any) { }
    }
}
