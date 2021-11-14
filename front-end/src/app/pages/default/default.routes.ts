import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DefaultComponent } from './default.component';

export const defaultRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: DefaultComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: HomeComponent
            }
        ]
    }
];
