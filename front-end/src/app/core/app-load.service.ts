import { Injectable, Injector } from '@angular/core';
import { AuthUser } from './auth/auth.model';
import { HttpService } from './http/http.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppLoadService {

    constructor(private injector: Injector) {
    }

    load(): Promise<void> {
        return new Promise(resolve => {
            const authService: AuthService = this.injector.get(AuthService);
            const httpService: HttpService = this.injector.get(HttpService);

            if (!authService.getAccessToken()) {
                resolve();
                return;
            }

            httpService.get('/oauth/initialize').subscribe((res: AuthUser) => {
                authService.setAuthUser(res ? res : null);
                resolve();
            }, () => {
                authService.setAuthUser(null);
                resolve();
            });
        });
    }

}
