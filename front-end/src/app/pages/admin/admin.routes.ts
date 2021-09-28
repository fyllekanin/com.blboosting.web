import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';
import { BoostComponent } from './pages/boosts/boost/boost.component';

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: DashboardComponent,
                resolve: {
                    data: DashboardResolver,
                },
            },
            {
                path: 'boosts',
                loadChildren: () =>
                    import('./pages/boosts/boosts.module').then(
                        (m) => m.BoostsModule
                    ),
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./pages/users/users.module').then(
                        (m) => m.UsersModule
                    ),
            },
        ],
    },
];
