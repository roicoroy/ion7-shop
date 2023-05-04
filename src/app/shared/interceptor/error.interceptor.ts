import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from "rxjs/operators";
import { Store } from '@ngxs/store';
import { ErrorLoggingActions } from 'src/app/store/error-logging/error-logging.actions';

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {

    private store = inject(Store);

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMsg = '';
                    if (error.error instanceof ErrorEvent) {
                        console.log('This is client side error');
                        errorMsg = `Error: ${error.error.message}`;
                        this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                    } else {
                        console.log('This is server side error');
                        errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
                        this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                    }
                    console.log(errorMsg);
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
                    return throwError(() => new Error(errorMsg));
                })
            )
    }
}
