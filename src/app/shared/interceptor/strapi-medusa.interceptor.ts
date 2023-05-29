
import { HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { throwError } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TokenService } from '../services/token/token.service';

@Injectable({
    providedIn: 'root'
})
export class StrapiMedusaInterceptor implements HttpInterceptor {
    tokenObservable: any;
    message: any = 'error message';
    token: string;
    private storage = inject(TokenService);

    intercept(request: HttpRequest<any>, next: HttpHandler): any {
        if (request.url.indexOf(environment.MEDUSA_API_BASE_PATH) === 0) {
            const clonedReq = this.medusaRequest(request);
            return next.handle(clonedReq) || null;
        }
        if (request.url.indexOf(environment.API_BASE_PATH) === 0) {
            return this.storage.getKeyAsObservable('token')
                .pipe(
                    take(1),
                    mergeMap((token) => {
                        const clonedReq = this.addToken(request, token);
                        return next.handle(clonedReq) || null;
                    }),
                    catchError((response: HttpErrorResponse) => throwError(() => new HttpErrorResponse(response)))
                );
        }
    }
    private addToken(request: HttpRequest<any>, token: any) {
        if (token) {
            const clone: HttpRequest<any> = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return clone;
        }
        return request;
    }
    private medusaRequest(request: HttpRequest<any>) {
        const clone: HttpRequest<any> = request.clone({
            setHeaders: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        return clone;
    }
}
