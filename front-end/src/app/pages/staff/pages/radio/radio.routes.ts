import { Routes } from '@angular/router';
import { RadioComponent } from './radio.component';
import { TimetableComponent } from '../../../../shared/components/timetable/timetable.component';
import { TimeTableTypes } from '../../../../shared/components/timetable/timetable.interface';
import { RequestsComponent } from './requests/requests.component';
import { RequestsService } from './requests/requests.service';
import { ConnectionInformationComponent } from './connection-information/connection-information.component';
import { ConnectionInformationResolver } from './connection-information/connection-information.resolver';

export const radioRoutes: Routes = [
    {
        path: '',
        component: RadioComponent,
        children: [
            {
                path: 'timetable/:day',
                component: TimetableComponent,
                data: {
                    type: TimeTableTypes.RADIO
                }
            },
            {
                path: 'requests',
                component: RequestsComponent,
                resolve: {
                    data: RequestsService
                }
            },
            {
                path: 'connection-information',
                component: ConnectionInformationComponent,
                resolve: {
                    data: ConnectionInformationResolver
                }
            }
        ]
    }
];
