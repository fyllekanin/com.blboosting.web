import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { TimetableModule } from '../../../../shared/components/timetable/timetable.module';
import { eventsRoutes } from './events.routes';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { ManageEventsService } from './manage-events/manage-events.service';
import { TableModule } from '../../../../shared/components/table/table.module';
import { ContentModule } from '../../../../shared/components/content/content.module';
import { FormsModule } from '@angular/forms';
import { CreateEventComponent } from './manage-events/create-event/create-event.component';

@NgModule({
    imports: [
        RouterModule.forChild(eventsRoutes),
        CommonModule,
        TimetableModule,
        TableModule,
        ContentModule,
        FormsModule
    ],
    declarations: [
        EventsComponent,
        ManageEventsComponent,
        CreateEventComponent
    ],
    providers: [
        ManageEventsService
    ],
    exports: [
        RouterModule
    ]
})
export class EventsModule {
}

