import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Inject, Injectable, Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, mergeMap, Observable, take, throwError } from 'rxjs';

import { TokenService } from '../services/token/token.service';
import { IErrorRes } from '../types/responses/AuthError';
import { StrapiAuthConfig } from '../types/StrapiAuthConfig';
import { AuthStateService } from 'src/app/store/auth/auth-state.service';
import { AuthStateActions } from 'src/app/store/auth/auth.actions';
import { Store } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import { StorageService } from '../services/storage/ionstorage.service';
import { request } from 'http';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private token: string;
  private AUTH_HEADER = 'Authorization';
  private storage = inject(StorageService);
  constructor(
    private store: Store,
    private tokenService: TokenService,
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // this.tokenService.getToken().then((token) => {
    //   this.token = token;
    // });

    return this.storage.getKeyAsObservable('token')
      .pipe(
        take(1),
        mergeMap(token => {
          if (!req.headers.has('Content-Type')) {
            req = req.clone({
              headers: req.headers.set('Content-Type', 'application/json')
            });
          }

          const clonedReq = this.addToken(req, token);

          return next.handle(clonedReq).pipe(
            catchError((error: HttpErrorResponse) => {
              const authError: IErrorRes = error.error;
              switch (error.status) {
                // Intercept unauthorized request
                case 401:
                  // Check if error response is caused by invalid token
                  if (authError.error.name === 'UnauthorizedError') {
                    return this.store.dispatch(new AuthStateActions.AuthStateLogout())
                  } else {
                    return throwError(() => error);
                  }
                case 403:
                  return throwError(() => error);
                case 404:
                  return throwError(() => error);
                default:
                  return throwError(() => error);
              }
            })
          ) as Observable<HttpEvent<any>>;
        }),
        catchError((response: HttpErrorResponse) => throwError(() => new HttpErrorResponse(response)))
      );
  }

  private addAuthenticationToken(request: HttpRequest<any>, token: string): HttpRequest<any> {

    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    if (!token) {
      return request;
    }
    // If you are calling an outside domain then do not add the token.
    if (!request.url.match(environment.BASE_PATH)) {
      return request;
    }
    if (!request.url.match(environment.BASE_PATH + '/api/upload')) {
      return request;
    }
    if (!request.url.match(environment.MEDUSA_API_BASE_PATH)) {
      return request;
    }

    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, 'Bearer ' + token)
    });
  }
  private addToken(request: HttpRequest<any>, token: any) {
    if (token) {
        // console.log(token);
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
    return request;
}
}

// TODO: Add Token refresh and prettify
