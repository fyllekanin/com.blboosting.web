import { Routes } from '@angular/router';
import { EventsComponent } from './events.component';
import { TimetableComponent } from '../../../../shared/components/timetable/timetable.component';
import { TimeTableTypes } from '../../../../shared/components/timetable/timetable.interface';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { ManageEventsService } from './manage-events/manage-events.service';

export const eventsRoutes: Routes = [
    {
        path: '',
        component: EventsComponent,
        children: [
            {
                path: 'timetable/:day',
                component: TimetableComponent,
                data: {
                    type: TimeTableTypes.EVENTS
                }
            },
            {
                path: 'manage',
                component: ManageEventsComponent,
                resolve: {
                    data: ManageEventsService
                }
            }
        ]
    }
];
