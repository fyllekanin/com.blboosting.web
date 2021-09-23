import {
    HttpErrorResponse,
    HttpHandler,
    HttpHeaderResponse,
    HttpInterceptor,
    HttpProgressEvent,
    HttpRequest,
    HttpResponse,
    HttpSentEvent,
    HttpUserEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError as observableThrowError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { SiteNotificationService } from '../common-services/site-notification.service';
import { SiteNotificationType } from '../../shared/app-views/site-notification/site-notification.interface';

interface UnauthorizedResponse {
    isTokenExisting: boolean;
    isPermissionRelated: boolean;
}

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    private isRefreshingToken = false;
    private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor (
        private authService: AuthService,
        private router: Router,
        private siteNotificationSerivce: SiteNotificationService
    ) {
    }

    intercept (req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        return next.handle(this.addToken(req, this.authService.getAccessToken())).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>error).status) {
                        case 401:
                            const response = <UnauthorizedResponse>error.error;
                            if (response.isPermissionRelated) {
                                this.router.navigateByUrl('/default/not-authorized');
                                return of(null);
                            }
                            if (response.isTokenExisting) {
                                return this.handleAuthenticationRefresh(req, next);
                            } else {
                                this.authService.setAuthUser(null);
                                const path = this.router.routerState.snapshot.url;
                                this.router.navigate(['auth', 'login'], {
                                    queryParams: {
                                        path: encodeURIComponent(path)
                                    }
                                });
                                return of(null);
                            }
                        case 404:
                            this.siteNotificationSerivce.create({
                                title: 'Not Found',
                                message: 'We could not find the page',
                                type: SiteNotificationType.INFO
                            });
                            this.router.navigateByUrl('/default/not-found');
                            return;
                        default:
                            return observableThrowError(error);
                    }
                } else {
                    return observableThrowError(error);
                }
            }));
    }

    private addToken (req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private handleAuthenticationRefresh (req: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.tokenSubject.next(null);
            return this.authService.refreshToken().pipe(
                switchMap((newToken: string) => {
                    if (newToken) {
                        this.tokenSubject.next(newToken);
                        return next.handle(this.addToken(req, newToken));
                    }
                    return this.logoutUser();
                }),
                catchError(this.logoutUser.bind(this)),
                finalize(() => {
                    this.isRefreshingToken = false;
                }));
        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addToken(req, token));
                }));
        }
    }

    private logoutUser (): Observable<any> {
        return observableThrowError('');
    }
}
