
import { HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { mergeMap, take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { StorageService } from '../services/storage/ionstorage.service';

@Injectable({
    providedIn: 'root'
})
export class StrapiMedusaInterceptor implements HttpInterceptor {
    tokenObservable: any;
    message: any = 'error message';
    token: string;
    private storage = inject(StorageService);

    intercept(request: HttpRequest<any>, next: HttpHandler): any {
        if (request.url.indexOf('../assets/i18n/en.json') === 0) {
            const clonedReq = request;
            return next.handle(clonedReq) || null;
        }
        if (request.url.indexOf(environment.MEDUSA_API_BASE_PATH) === 0) {
            const clonedReq = this.medusaRequest(request);
            return next.handle(clonedReq) || null;
        }
        if (request.url.indexOf(environment.BASE_PATH) === 0) {
            return this.storage.getKeyAsObservable('token')
                .pipe(
                    take(1),
                    mergeMap(token => {
                        const clonedReq = this.addToken(request, token);
                        return next.handle(clonedReq) || null;
                    }),
                    catchError((response: HttpErrorResponse) => throwError(() => new HttpErrorResponse(response)))
                );
        }
        return next.handle(request) || null;
    }
    private addToken(request: HttpRequest<any>, token: any) {
        // console.log('medusa', request);
        if (token) {
            const clone: HttpRequest<any> = request.clone({
                headers: new HttpHeaders({
                    'Authorization': `Bearer ${token}`,
                }),
            });
            return clone;
        }
        return request;
    }
    private medusaRequest(request: HttpRequest<any>) {
        // console.log('medusa', request.url);
        const clone: HttpRequest<any> = request.clone({
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            withCredentials: true,
        });

        return clone
    }
}
