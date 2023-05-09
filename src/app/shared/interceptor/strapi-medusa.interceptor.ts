
import { HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { mergeMap, take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TokenService } from '../services/token/token.service';
import { from, throwError } from 'rxjs';
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
        if (request.url.indexOf(environment.MEDUSA_API_BASE_PATH) === 0) {
            const clonedReq = this.medusaRequest(request);
            return next.handle(clonedReq) || null;
        } 
        if(request.url.indexOf(environment.API_BASE_PATH) === 0){
            return this.storage.getKeyAsObservable('token')
            .pipe(
                take(1),
                mergeMap(res => {
                    const token = res.value;
                    console.log(token);
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
                    Authorization: `Bearer ${token}`
                }
            });
            return clone;
        }
        // if (!token) {
        //     this.router.navigateByUrl('/auth/login');
        // }
        return request;
    }
    private medusaRequest(request: HttpRequest<any>) {
        console.log('medusa interceptor');
        return request;
    }
}
