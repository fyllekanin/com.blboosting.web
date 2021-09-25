import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog/dialog.component';
import { RouterModule } from '@angular/router';
import { SiteNotificationComponent } from './site-notification/site-notification.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    declarations: [
        DialogComponent,
        SiteNotificationComponent
    ],
    exports: [
        DialogComponent,
        SiteNotificationComponent
    ]
})
export class AppViewsModule {
}


