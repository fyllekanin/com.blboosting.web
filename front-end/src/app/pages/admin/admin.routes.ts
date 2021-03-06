import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';
import { BattleNetConnectComponent } from './pages/battle-net-connect/battle-net-connect.component';

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
                    data: DashboardResolver
                }
            },
            {
                path: 'battle-net',
                component: BattleNetConnectComponent
            },
            {
                path: 'boosts',
                loadChildren: () =>
                    import('./pages/boosts/boosts.module').then(
                        (m) => m.BoostsModule
                    )
            },
            {
                path: 'users',
                loadChildren: () =>
                    import('./pages/users/users.module').then(
                        (m) => m.UsersModule
                    )
            },
            {
                path: 'roles',
                loadChildren: () =>
                    import('./pages/roles/roles.module').then(
                        (m) => m.RolesModule
                    )
            }
        ]
    }
];
