import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DialogService } from './common-services/dialog.service';
import { HttpService } from './http/http.service';
import { HttpRequestInterceptor } from './http/http.interceptor';
import { AuthService } from './auth/auth.service';
import { SiteNotificationService } from './common-services/site-notification.service';
import { GlobalErrorService } from './common-services/global-error.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [],
    providers: [],
    exports: []
})

export class CoreModule {
    static forRoot(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                HttpService,
                { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
                { provide: ErrorHandler, useClass: GlobalErrorService },
                AuthService,
                DialogService,
                SiteNotificationService
            ]
        };
    }
}
