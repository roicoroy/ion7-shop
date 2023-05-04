import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IReqAuthRegister } from "src/app/shared/types/requests/ReqAuthRegister";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class EmailPasswordService {

    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private httpClient: HttpClient,
    ) { }

    loginEmailPassword(email: string, password?: string) {
        const strapiRequest = {
            identifier: email,
            password,
        };
        // console.log(strapiRequest);
        return this.httpClient.post(environment.BASE_PATH + '/api/auth/local', strapiRequest, { headers: this.headers });
    }
    registerEmailPassword(email: string, password?: string) {
        const strapiRequest: IReqAuthRegister = {
            username: email,
            email,
            password,
        };
        // console.log(strapiRequest);
        return this.httpClient.post(environment.BASE_PATH + '/api/auth/local/', strapiRequest, { headers: this.headers });
    }
}
