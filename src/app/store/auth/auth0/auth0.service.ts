import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Browser } from '@capacitor/browser';
import { StrapiAuthProviders } from "src/app/shared/types/StrapiAuthConfig";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class Auth0Service {
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    constructor(
        private httpClient: HttpClient,
    ) { }
    /**
     * Login user using external provider
     * Auth0
     */
    async loginStrapiAuth0() {
        const url = `${environment.BASE_PATH}/api/connect/${'auth0'}`;
        await Browser.open({ url, windowName: '_self' });
    }
    /**
     * Login user using external provider
     * like google / facebook / microsoft / github
     */
    callbackProviderLogin(params: string, provider: StrapiAuthProviders) {
        return this.httpClient.get(environment.BASE_PATH + '/api/auth/' + provider + '/callback?id_token=' + params, { headers: this.headers });
    }
}
