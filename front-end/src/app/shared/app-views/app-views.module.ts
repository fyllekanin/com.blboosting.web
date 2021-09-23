import { RadioContentComponent } from './header/radio/radio-content/radio-content.component';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { HeaderRadioComponent } from './header/radio/header-radio.component';
import { DialogComponent } from './dialog/dialog.component';
import { RouterModule } from '@angular/router';
import { SiteNotificationComponent } from './site-notification/site-notification.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule
    ],
    declarations: [
        HeaderComponent,
        HeaderRadioComponent,
        NavigationComponent,
        DialogComponent,
        SiteNotificationComponent,
        RadioContentComponent,
        FooterComponent
    ],
    exports: [
        HeaderComponent,
        NavigationComponent,
        DialogComponent,
        SiteNotificationComponent,
        FooterComponent
    ]
})
export class AppViewsModule {
}


