import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICustomerLoginData, ICustomerRegisterData } from '../../types/types.interfaces';

@Injectable({
    providedIn: 'root'
})
export class MedusaService {
    // medusa: any;
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        withCredentials: true,
    };
    private http = inject(HttpClient);

    constructor() {
    }

    medusaExistsHttp(email: string) {
        return this.http.get(environment.MEDUSA_API_BASE_PATH + '/store/auth/' + email, this.httpOptions);
    }
    loginEmailPassword(email: string, password?: string) {
        const loginReq: ICustomerLoginData = {
            email: email,
            password: email,
        };
        // console.log(loginReq);
        return this.http.post(environment.MEDUSA_API_BASE_PATH + '/store/auth/', loginReq, this.httpOptions);
    }
    createMedusaCustomer(email: string) {
        const registerRequest: ICustomerRegisterData = {
            email: email,
            password: email,
        };
        return this.http.post(environment.MEDUSA_API_BASE_PATH + '/store/customers/', registerRequest, this.httpOptions);
    }
    getMedusaSession() {
        return this.http.get(environment.MEDUSA_API_BASE_PATH + '/store/auth/', this.httpOptions);
    }
    retrieveMedusaCustomer() {
        return this.http.get(environment.MEDUSA_API_BASE_PATH + '/store/customers/me', this.httpOptions);
    }

}
