import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DefaultComponent } from './default.component';
import { ErrorComponent } from './error/error.component';

export const defaultRoutes: Routes = [
    {
        path: '',
        component: DefaultComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: HomeComponent
            },
            {
                path: 'error',
                component: ErrorComponent
            }
        ]
    }
];
