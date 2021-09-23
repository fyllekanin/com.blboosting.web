import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthService, Checks } from '../../core/auth/auth.service';
import { DashboardResolver } from './pages/dashboard/dashboard.resolver';

export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        data: {
            type: Checks.ADMIN
        },
        resolve: {
            check: AuthService
        },
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
                path: 'users',
                loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)
            },
            {
                path: 'website-settings',
                loadChildren: () => import('./pages/website-settings/website-settings.module').then(m => m.WebsiteSettingsModule)
            }
        ]
    }
];
