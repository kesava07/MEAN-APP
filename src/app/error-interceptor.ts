import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators'
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppErrorComponent } from './Error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorContent = "An unknown error occured..!";
                if (error.error.message) {
                    errorContent = error.error.message;
                }
                this.dialog.open(AppErrorComponent, {
                    data: { message: errorContent },
                    width: '300px'
                });
                return throwError(error);
            })
        )
    }
}