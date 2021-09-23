import { Injectable, Injector } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { HttpService } from './http/http.service';
import { AuthUser } from './auth/auth-user.model';
import { RadioService } from './common-services/radio.service';
import { RadioSettingsClass } from '../shared/classes/radio-settings.class';

@Injectable()
export class AppLoadService {

    constructor (private injector: Injector) {
    }

    load (): Promise<any> {
        return new Promise(resolve => {
            const authService: AuthService = this.injector.get(AuthService);
            const httpService: HttpService = this.injector.get(HttpService);
            const radioService: RadioService = this.injector.get(RadioService);

            httpService.get('/auth/initial').subscribe((res: { authUser: AuthUser, radioSettings: RadioSettingsClass }) => {
                authService.setAuthUser(res && res.authUser ? res.authUser : null);
                radioService.setRadioSettings(res.radioSettings);
                resolve();
            });
        });
    }

}
