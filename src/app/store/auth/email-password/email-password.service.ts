import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { IReqAuthRegister } from "src/app/shared/types/requests/ReqAuthRegister";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class EmailPasswordService {

    private readonly headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    private http = inject(HttpClient);

    loginEmailPassword(email: string, password?: string) {
        const req = {
            identifier: email,
            password,
        };
        // console.log(strapiRequest);
        const url =`${environment.BASE_PATH}/api/auth/local`;
        return this.http.post(url, req, { headers: this.headers });
    }
    registerEmailPassword(form: IReqAuthRegister) {
        const req: IReqAuthRegister = {
            first_name: form.first_name,
            last_name: form.last_name,
            username: form.email,
            email: form.email,
            password: form.password,
        };
        console.log(req);

        const url = `${environment.BASE_PATH}/api/auth/local/register`;
        return this.http.post(url, req, { headers: this.headers });
    }
    forgotPassword(email: string) {
        const req = {
            email,
        };
        console.log(req);
        const url = `${environment.BASE_PATH}/api/passwordless/send-link`;
        return this.http.post(url, req, { headers: this.headers })
    }
}
