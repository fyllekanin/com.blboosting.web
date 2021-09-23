import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppViewsModule } from './shared/app-views/app-views.module';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { AppLoadService } from './core/app-load.service';

export function init_app (appLoadService: AppLoadService) {
    return () => appLoadService.load();
}

@NgModule({
    imports: [
        CoreModule.forRoot(),
        RouterModule.forRoot(appRoutes, {
            onSameUrlNavigation: 'reload',
            anchorScrolling: 'enabled'
        }),
        AppViewsModule,
        BrowserModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AppLoadService,
        { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
