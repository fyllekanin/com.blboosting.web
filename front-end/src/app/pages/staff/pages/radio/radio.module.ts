import { ContentModule } from './../../../../shared/components/content/content.module';
import { RequestsService } from './requests/requests.service';
import { RequestsComponent } from './requests/requests.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RadioComponent } from './radio.component';
import { TimetableModule } from '../../../../shared/components/timetable/timetable.module';
import { radioRoutes } from './radio.routes';
import { ConnectionInformationComponent } from './connection-information/connection-information.component';
import { ConnectionInformationResolver } from './connection-information/connection-information.resolver';

@NgModule({
    imports: [
        RouterModule.forChild(radioRoutes),
        CommonModule,
        TimetableModule,
        ContentModule
    ],
    declarations: [
        RadioComponent,
        RequestsComponent,
        ConnectionInformationComponent
    ],
    providers: [
        RequestsService,
        ConnectionInformationResolver
    ],
    exports: [
        RouterModule
    ]
})
export class RadioModule {
}

