import { Injectable } from '@angular/core';
import { AuthUser } from './auth.model';
import { LocalStorageKeys } from '../../shared/constants/local-storage.constants';
import { Observable, throwError } from 'rxjs';
import { HttpService } from '../http/http.service';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SiteNotificationService } from '../common-services/site-notification.service';
import { SiteNotificationType } from '../../shared/app-views/site-notification/site-notification.interface';

@Injectable()
export class AuthService {
    private authUser: AuthUser;

    constructor(
        private httpService: HttpService,
        private router: Router,
        private siteNotificationService: SiteNotificationService
    ) {
        this.authUser = this.getAuthUser();
    }

    getRefreshToken(): string {
        return this.authUser?.refreshToken;
    }

    getAccessToken(): string {
        return this.authUser?.accessToken;
    }

    setAuthUser(payload: AuthUser): void {
        this.authUser = payload;
        this.updateAuthUser();
    }

    getUser(): AuthUser {
        return { ...this.authUser };
    }

    logout(): void {
        this.setAuthUser(null);
        this.siteNotificationService.create({
            title: 'Logout',
            message: 'You have logged out',
            type: SiteNotificationType.INFO
        });
        this.router.navigateByUrl('/auth');
    }

    refreshToken(): Observable<string> {
        return this.httpService.get('/oauth/refresh-token', {
            headers: {
                'RefreshAuthorization': this.getRefreshToken()
            }
        }).pipe(map((res: AuthUser) => {
            this.authUser = res;
            this.updateAuthUser();
            return this.getAccessToken();
        }), catchError(error => {
            this.authUser = null;
            this.updateAuthUser();
            return throwError(error);
        }));
    }


    private updateAuthUser(): void {
        localStorage.setItem(LocalStorageKeys.AUTH_USER, JSON.stringify(this.authUser));
    }

    private getAuthUser(): AuthUser {
        try {
            return JSON.parse(localStorage.getItem(LocalStorageKeys.AUTH_USER));
        } catch (_e) {
            return null;
        }
    }
}
