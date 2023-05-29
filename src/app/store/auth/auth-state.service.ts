import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Browser } from "@capacitor/browser";
import { Observable } from "rxjs";
import { StrapiAuthProviders } from "src/app/shared/types/StrapiAuthConfig";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthStateService {
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
        withCredentials: true,
    };
    constructor(
        private httpClient: HttpClient,
    ) { }

    medusaLogout() {
        return this.httpClient.delete(environment.MEDUSA_API_BASE_PATH + '/store/auth', this.httpOptions);
    }
    getMedusaSession() {
        return this.httpClient.get(environment.MEDUSA_API_BASE_PATH + '/store/auth', this.httpOptions);
    }
    retrieveMedusaCustomer() {
        return this.httpClient.get(environment.MEDUSA_API_BASE_PATH + '/store/customers/me', this.httpOptions);
    }
    checkCustomerExists(email: string) {
        return this.httpClient.get(environment.MEDUSA_API_BASE_PATH + '/store/auth' + email, this.httpOptions);
    }
    loginCustomer(email: string) {
        const req = {
            "first_name": email,
            "last_name": email,
        }
        return this.httpClient.post(environment.MEDUSA_API_BASE_PATH + '/store/auth', req, this.httpOptions);
    }
    createCustomer(email: string) {
        const req = {
            "first_name": email,
            "last_name": email,
            "email": email,
            "password": email,
        }
        return this.httpClient.post(environment.MEDUSA_API_BASE_PATH + '/store/customers', req, this.httpOptions);
    }
    async loginStrapiAuth0() {
        const url = `${environment.BASE_PATH}/api/connect/${'auth0'}`;
        await Browser.open({ url, windowName: '_self' });
    }
    callbackProviderLogin(params: string, provider: StrapiAuthProviders) {
        return this.httpClient.get(environment.BASE_PATH + '/api/auth/' + provider + '/callback' + params, { headers: this.headers });
    }
    public loadUser(userId: string): Observable<any> {
        return this.httpClient.get(environment.BASE_PATH + '/api/users/' + userId + '?populate=*', { headers: this.headers })
    }
}

