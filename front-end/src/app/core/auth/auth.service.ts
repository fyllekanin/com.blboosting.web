import { Injectable } from '@angular/core';
import { AuthUser } from './auth-user.model';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpService } from '../http/http.service';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageKeys } from '../../shared/constants/local-storage.constants';
import { SiteNotificationService } from '../common-services/site-notification.service';
import { SiteNotificationType } from '../../shared/app-views/site-notification/site-notification.interface';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

export enum Checks {
    STAFF,
    ADMIN
}

@Injectable()
export class AuthService implements Resolve<void> {
    private authUser: AuthUser;
    private onAuthChangeSubject: Subject<void> = new Subject<void>();
    onAuthChange = this.onAuthChangeSubject.asObservable();

    constructor(
        private httpService: HttpService,
        private siteNotificationService: SiteNotificationService,
        private router: Router) {
        this.authUser = this.getStoredAuthUser();
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
        const path = this.router.getCurrentNavigation().extractedUrl.root.children.primary.segments.reduce((prev, curr) => {
            return `${prev}/${curr}`;
        }, '');
        if (!this.isLoggedIn()) {
            await this.router.navigate(['auth', 'login'], {
                queryParams: {
                    path: encodeURIComponent(path)
                }
            });
            return;
        }
        switch (route.data.type) {
            case Checks.STAFF:
                if (!this.authUser.doHaveStaffPermissions) {
                    await this.router.navigateByUrl('/default/not-authorized');
                }
                break;
            case Checks.ADMIN:
                if (!this.authUser.doHaveAdminPermissions) {
                    await this.router.navigateByUrl('/default/not-authorized');
                }
                break;
        }
    }

    isLoggedIn(): boolean {
        return Boolean(this.authUser);
    }

    refreshToken(): Observable<string> {
        return this.httpService.post('/auth/token-refresh', null, {
            headers: {
                'RefreshAuthorization': this.getRefreshToken()
            }
        }).pipe(map((res: AuthUser) => {
            this.authUser = res;
            this.updateStoredAuthUser(this.authUser);
            return this.getAccessToken();
        }), catchError(error => {
            this.authUser = null;
            this.updateStoredAuthUser(null);
            return throwError(error);
        }));
    }

    doLogin(username: string, password: string): Promise<boolean> {
        return new Promise(res => {
            this.httpService.post('/auth/login', {username: username, password: password})
                .subscribe(user => {
                    this.setAuthUser(<AuthUser>user);
                    this.siteNotificationService.create({
                        title: 'Success',
                        message: 'You are logged in!',
                        type: SiteNotificationType.SUCCESS
                    });
                    res(true);
                }, () => {
                    res(false);
                });
        });
    }

    doRegister(data: { username: string, habbo: string, password: string, repassword: string }): Promise<boolean> {
        return new Promise(res => {
            this.httpService.post('/auth/register', data)
                .subscribe(user => {
                    this.setAuthUser(<AuthUser>user);
                    this.siteNotificationService.create({
                        title: 'Success',
                        message: 'You have registered!',
                        type: SiteNotificationType.SUCCESS
                    });
                    this.router.navigateByUrl('/auth/login');
                    res(true);
                }, error => {
                    this.siteNotificationService.onError(error.error);
                    res(false);
                });
        });
    }

    logout(): void {
        this.httpService.post('/auth/logout', null)
            .subscribe(() => {
                this.authUser = null;
                this.updateStoredAuthUser(this.authUser);
                this.siteNotificationService.create({
                    title: 'Success',
                    message: 'You have logged out',
                    type: SiteNotificationType.SUCCESS
                });
                this.onAuthChangeSubject.next();
                this.router.navigateByUrl('/auth/login');
            });
    }

    getAccessToken(): string {
        return this.isLoggedIn() ? this.authUser.accessToken : null;
    }

    getRefreshToken(): string {
        return this.isLoggedIn() ? this.authUser.refreshToken : null;
    }

    getAuthUser(): AuthUser {
        return this.authUser;
    }

    setAuthUser(authUser: AuthUser): void {
        this.authUser = authUser ? authUser : null;
        this.updateStoredAuthUser(this.authUser);
        this.onAuthChangeSubject.next();
    }

    private updateStoredAuthUser(authUser: AuthUser): void {
        localStorage.setItem(LocalStorageKeys.AUTH_USER, JSON.stringify(authUser));
    }

    private getStoredAuthUser(): AuthUser {
        const json = localStorage.getItem(LocalStorageKeys.AUTH_USER);
        try {
            const parsed = JSON.parse(json);
            return parsed ? parsed as AuthUser : null;
        } catch (e) {
            return null;
        }
    }
}
