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

    constructor(
        private httpClient: HttpClient,
    ) { }

    async loginStrapiAuth0() {
        const url = `${environment.BASE_PATH}/api/connect/${'auth0'}`;
        await Browser.open({ url, windowName: '_self' });
    }
    callbackProviderLogin(params: string, provider: StrapiAuthProviders) {
        return this.httpClient.get(environment.BASE_PATH + '/api/auth/' + provider + '/callback' + params);
    }
    medusaLogout() {
        return this.httpClient.delete(environment.MEDUSA_API_BASE_PATH + '/store/auth/', { headers: this.headers });
    }
    retrieveMedusaCustomer() {
        return this.httpClient.get(environment.MEDUSA_API_BASE_PATH + '/store/auth/');
    }
    public loadUser(userId: string): Observable<any> {
        return this.httpClient.get(environment.BASE_PATH + '/api/users/' + userId + '?populate=*', { headers: this.headers })
    }
}
