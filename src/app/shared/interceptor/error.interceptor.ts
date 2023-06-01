import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import { Store } from '@ngxs/store';
import { ErrorLoggingActions } from 'src/app/store/error-logging/error-logging.actions';
import { AuthStateActions } from 'src/app/store/auth/auth.actions';
import { NavigationService } from '../services/navigation/navigation.service';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {

    private store = inject(Store);
    private navigation = inject(NavigationService);

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMsg = '';
                    console.log(error.error);
                    switch (error.status) {
                        case 401:
                            // if (error.error === "Unauthorized") {
                            //     this.store.dispatch(new AuthStateActions.AuthStateLogout());
                            //     this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                            //     this.navigation.navControllerDefault('auth/pages/auth-home');
                            // } else {
                            //     return throwError(() => error);
                            // }
                            this.store.dispatch(new AuthStateActions.AuthStateLogout());
                            this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                            this.navigation.navControllerDefault('auth/pages/auth-home');
                            return throwError(() => error);
                            // break;
                        case 403:
                            throwError(() => error);
                            break;
                        case 404:
                            throwError(() => error);
                            break;
                        default:
                            throwError(() => error);
                            break;
                    }
                    if (error.error instanceof ErrorEvent) {
                        this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                    } 
                })
            )
    }
}
