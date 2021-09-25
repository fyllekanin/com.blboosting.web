import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DefaultComponent } from './default.component';

export const defaultRoutes: Routes = [
    {
        path: '',
        component: DefaultComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'not-found',
                component: NotFoundComponent
            }
        ]
    }
];
