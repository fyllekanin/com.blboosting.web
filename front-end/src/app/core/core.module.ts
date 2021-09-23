import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RadioService } from './common-services/radio.service';
import { DialogService } from './common-services/dialog.service';
import { HttpService } from './http/http.service';
import { HttpRequestInterceptor } from './http/http.interceptor';
import { AuthService } from './auth/auth.service';
import { SiteNotificationService } from './common-services/site-notification.service';
import { ContinuesInformationService } from './common-services/continues-information.service';
import { GlobalBbcodeService } from './common-services/global-bbcode.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [],
    providers: [],
    exports: []
})

export class CoreModule {
    static forRoot (): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                HttpService,
                {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
                AuthService,
                RadioService,
                DialogService,
                SiteNotificationService,
                ContinuesInformationService,
                GlobalBbcodeService
            ]
        };
    }
}
