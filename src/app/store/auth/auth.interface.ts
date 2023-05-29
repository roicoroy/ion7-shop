import { ICustomer } from "src/app/shared/types/types.interfaces";

export class IAuthStateModel {
    isLoggedIn: boolean;
    userId: string;
    customer: ICustomer;
    session: any;
    userEmail: string;
    medusaId: string;
    hasSession: boolean;
}