import { Routes } from '@angular/router';
import { BoostsComponent } from './boosts.component';
import { BoostsListComponent } from './boosts-list/boosts-list.component';
import { BoostComponent } from './boost/boost.component';
import { BoostResolver } from './boost/boost.resolver';

export const boostsRoutes: Routes = [
    {
        path: '',
        component: BoostsComponent,
        children: [
            {
                path: 'page/:page',
                component: BoostsListComponent
            },
            {
                path: 'boost/:id',
                component: BoostComponent,
                resolve: {
                    data: BoostResolver
                }
            }
        ]
    }
];
